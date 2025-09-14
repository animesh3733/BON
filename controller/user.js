const { insertIntoDB, findInDB } = require('../db');
const { logInfo, logError, validateFields } = require('../utils');

async function createUser(req, res) {
  try {
    const body = req?.body;
    const validation = validateFields(body, ['userName', 'userEmail']);

    if (!validation.isValid) {
      logError('Validation failed for createUser', { missing: validation.missingFields });
      return res.status(400).send('Invalid request. Please provide all required user details.');
    }

    const { userName, userEmail } = body;
    const r = await insertIntoDB('users', { name: userName, email: userEmail });

    logInfo(`User created with id ${r.insertedId}`);
    res.status(200).send({ identifier: r.insertedId, userName, userEmail });
  } catch (err) {
    logError('Failed to create user', { error: err });
    res.status(400).send('Failed to create user');
  }
}

async function listRewards(req, res) {
  try {
    const params = req?.params;
    const validation = validateFields(params, ['id']);

    if (!validation.isValid) {
      logError('Validation failed for listRewards', { missing: validation.missingFields });
      return res.status(400).send('Invalid request. A valid user ID is required.');
    }

    const rewards = await findInDB('rewards', { userId: params.id });
    if (rewards.length === 0) {
      logInfo(`No rewards found for userId: ${params.id}`);
      return res.status(404).send('No rewards found');
    }

    logInfo(`Rewards retrieved for userId: ${params.id}, count: ${rewards.length}`);
    res.status(200).send(rewards);
  } catch (err) {
    logError('Failed to fetch rewards', { error: err });
    res.status(400).send('Failed to fetch rewards');
  }
}

async function listBills(req, res) {
  try {
    const params = req?.params;
    const validation = validateFields(params, ['id']);

    if (!validation.isValid) {
      logError('Validation failed for listBills', { missing: validation.missingFields });
      return res.status(400).send('Invalid request. A valid user ID is required.');
    }

    const bills = await findInDB('bills', { userId: params.id });
    if (bills.length === 0) {
      logInfo(`No bills found for userId: ${params.id}`);
      return res.status(404).send('No bills found');
    }

    logInfo(`Bills retrieved for userId: ${params.id}, count: ${bills.length}`);
    res.status(200).send(bills);
  } catch (err) {
    logError('Failed to fetch bills', { error: err });
    res.status(400).send('Failed to fetch bills');
  }
}

module.exports = {
  createUser,
  listRewards,
  listBills,
};
