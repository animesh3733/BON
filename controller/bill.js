const { insertIntoDB, updateDB, findInDB } = require('../db');
const { validateFields } = require('../utils');
const { logError, logInfo } = require('../utils');

async function createBill(req, res) {
  try {
    const { isValid, missingFields } = validateFields(req?.body, ['userId', 'dueDate', 'amount', 'paymentMethod']);
    if (!isValid) {
      logError('Validation failed in createBill', { missingFields });
      return res.status(400).send({ error: 'Some required information is missing. Please check your input.' });
    }

    const { userId, dueDate, amount, paymentMethod } = req.body;

    const r = await insertIntoDB('bills', {
      userId: String(userId),
      dueDate,
      amount,
      paymentMethod,
      paymentDate: null,
    });

    logInfo('Bill created successfully', { billId: r.insertedId, userId, dueDate });

    return res.status(200).send({identifier: r.insertedId,userId,dueDate});
  } catch (err) {
    logError('Error creating bill', { error: err });
    return res.status(400).send({ error: 'Something went wrong while creating the bill. Please try again later.' });
  }
}

function validatePayBillRequest(req) {
  const { isValid, missingFields } = validateFields(req?.body, [
    'userId',
    'billId',
    'paymentDate',
  ]);

  if (!isValid) {
    logError('Validation failed in payBill', { missingFields });
    return { valid: false, error: 'Some required information is missing. Please check your input.' };
  }
  return { valid: true };
}

async function updateBillPayment(userId, billId, paymentDate) {
  const upd = await updateDB(
    'bills',
    { identifier: billId, userId: String(userId) },
    { $set: { paymentDate } }
  );

  if (!upd.matchedCount) {
    logError('Bill not found for user', { billId, userId });
    return null;
  }

  return upd;
}

async function isEligibleForReward(userId) {
  const latestBills = await findInDB(
    'bills',
    { userId: String(userId), paymentDate: { $ne: null } },
    { sort: { dueDate: -1 }, limit: 3 }
  );
  if (latestBills.length < 3) return false;
  return latestBills.every(b => new Date(b.paymentDate) <= new Date(b.dueDate));
}

async function handleReward(userId) {
  if (!(await isEligibleForReward(userId))) {
    return false;
  }

  const recentRewards = await findInDB(
    'rewards',
    { userId: String(userId) },
    { sort: { issuedAt: -1 }, limit: 1 }
  );

  let alreadyRewarded = false;

  if (recentRewards.length) {
    const latestBills = await findInDB(
      'bills',
      { userId: String(userId), paymentDate: { $ne: null } },
      { sort: { dueDate: -1 }, limit: 3 }
    );

    const latestPaid = latestBills.reduce(
      (max, b) => (new Date(b.paymentDate) > new Date(max) ? b.paymentDate : max),
      '1970-01-01'
    );

    if (new Date(recentRewards[0].issuedAt) > new Date(latestPaid)) {
      alreadyRewarded = true;
    }
  }

  if (!alreadyRewarded) {
    await insertIntoDB('rewards', {
      userId: String(userId),
      reward: '$10 Amazon Gift Card',
      issuedAt: new Date().toISOString(),
    });
    logInfo('Reward issued', { userId, reward: '$10 Amazon Gift Card' });
    return true;
  }

  return false;
}


async function payBill(req, res) {
  try {
    const validation = validatePayBillRequest(req);
    if (!validation.valid) {
      return res.status(400).send({ error: validation.error });
    }

    const { userId, billId, paymentDate } = req.body;

    // Update bill
    const upd = await updateBillPayment(userId, billId, paymentDate);
    if (!upd) {
      return res.status(404).send({ error: 'No matching bill found for the given user.' });
    }

    // Handle reward
    const rewardIssued = await handleReward(userId);

    logInfo('Bill paid successfully', { billId, userId, rewardIssued });
    return res.status(200).send({ paid: true, rewardIssued });
  } catch (err) {
    logError('Error processing payment', { error: err });
    return res.status(400).send({
      error: 'Something went wrong while processing the payment. Please try again later.',
    });
  }
}

module.exports = {
  createBill,
  payBill,
};
