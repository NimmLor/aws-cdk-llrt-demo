export const handler = async (event: { discountValue: number }) => {
  console.log('Discount generator invoked', {
    event: JSON.stringify(event),
  })

  console.log(`Generating discount of value ${event.discountValue}`)

  const result = {
    discountValue: event.discountValue,
    code: `${Math.random()}`.split('.')[1],
  }

  console.log('Discount generated', { result })

  return result
}
