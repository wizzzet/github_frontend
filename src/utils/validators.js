/* eslint-disable */
const emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([a-zA-Z\-0-9]{2,}\.)+[a-zA-Z]{2,})$/
/* eslint-enable */

export const email = value => value ? emailRe.test(value) : true
