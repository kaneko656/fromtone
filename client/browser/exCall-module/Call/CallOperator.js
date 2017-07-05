// CallOperator

module.exports = (Child, num) => {
    return {
        remove: () => {
            Child.remove(num)
        },
        setCallStatus: (status) => {
            Child.setCallStatus(num, status)
        },
        isCall: () => {
            return Child.isCall(num)
        },
        getName: () => {
            return Child.getName()
        },
        num: num
    }
}
