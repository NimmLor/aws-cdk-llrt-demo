const tableName = process.env.TABLE_NAME as string

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { Entity, Table } from 'dynamodb-toolbox'

const DocumentClient = DynamoDBDocumentClient.from(new DynamoDBClient(), {
  marshallOptions: { convertEmptyValues: false },
})

const MyTable = new Table({
  name: tableName,
  partitionKey: 'PK',
  sortKey: 'SK',
  DocumentClient,
})

const Customer = new Entity({
  name: 'Customer',
  attributes: {
    PK: {
      partitionKey: true,
      default: (data: { customerId: string }) => `CUSTOMER#${data.customerId}`,
    },
    SK: {
      hidden: true,
      sortKey: true,
      default: ({ dateAdded, status }: { status: string; dateAdded: string }) =>
        `CUSTOMER#${status}#${dateAdded}`,
    },
    customerId: { type: 'string' },
    age: { type: 'number' },
    name: { type: 'string', map: 'data' },
    emailVerified: { type: 'boolean', required: true },
    status: { type: 'string' },
    dateAdded: { type: 'string' },
  },
  table: MyTable,
} as const)

export const testDynamodbToolbox = async () => {
  const customerId = 'customer-1'
  const dateAdded = new Date().toISOString().split('T')[0]

  const putResponse = await Customer.put({
    emailVerified: true,
    customerId,
    name: 'John Doe',
    age: 30,
    status: 'active',
    dateAdded,
  })

  const getResponse = await Customer.get({
    PK: `CUSTOMER#${customerId}`,
    SK: `CUSTOMER#active#${dateAdded}`,
  }).catch((err) => err ?? null)

  const rawGetResponse = await Customer.get(
    {
      PK: `CUSTOMER#${customerId}`,
      SK: `CUSTOMER#active#${dateAdded}`,
    },
    { parse: false }
  ).catch((err) => err ?? null)

  const queryResponse = await Customer.query(`CUSTOMER#${customerId}`, {
    beginsWith: 'CUSTOMER#active#',
  }).catch((err) => err ?? null)

  const updateResponse = await Customer.update({
    customerId,
    SK: `CUSTOMER#active#${dateAdded}`,
    age: 31,
  }).catch((err) => err ?? null)

  const getAfterUpdateResponse = await Customer.get({
    PK: `CUSTOMER#${customerId}`,
    SK: `CUSTOMER#active#${dateAdded}`,
  }).catch((err) => err ?? null)

  const deleteResponse = await Customer.delete({
    PK: `CUSTOMER#${customerId}`,
    SK: `CUSTOMER#active#${dateAdded}`,
  }).catch((err) => err ?? null)

  const getAfterDeleteResponse = await Customer.get({
    PK: `CUSTOMER#${customerId}`,
    SK: `CUSTOMER#active#${dateAdded}`,
  }).catch((err) => err ?? null)

  return {
    putResponse,
    getResponse,
    rawGetResponse,
    queryResponse,
    updateResponse,
    getAfterUpdateResponse,
    deleteResponse,
    getAfterDeleteResponse,
  }
}
