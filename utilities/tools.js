function formatDate(data) {
  let newDate = new Date(data)
  const year = newDate.getFullYear()
  const month = (newDate.getMonth() < 9) ? `0${newDate.getMonth() + 1}` : newDate.getMonth() + 1
  const day = (newDate.getDate() < 10) ? `0${newDate.getDate()}` : newDate.getDate()
  const hours = (newDate.getHours() < 10) ? `0${newDate.getHours()}` : newDate.getHours()
  const minutes = (newDate.getMinutes() < 10) ? `0${newDate.getMinutes()}` : newDate.getMinutes()
  const seconds = (newDate.getSeconds() < 10) ? `0${newDate.getSeconds()}` : newDate.getSeconds()

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

module.exports = {
  formatDate
}
