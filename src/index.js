
const modele = require('./proxy')
const { beProxied } = modele

const person = beProxied({name: 'hopperhuang'})
person.name = 'hopper'
console.log(person.name)
