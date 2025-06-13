export function generateOrderNumber(): string {
  const caracteres =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let orderNumber = ''

  for (let i = 0; i < 20; i++) {
    const index = Math.floor(Math.random() * caracteres.length)
    orderNumber += caracteres[index]
  }

  return orderNumber
}
