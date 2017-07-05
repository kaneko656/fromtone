// CallOperator

module.exports = (Child, num) => {
    return {
        remove: () => {
            Child.remove(num)
        },
        setCallStatus: (status) => {
            Child.setCallStatus(num, status)
        },
        isStatus: () => {
            return Child.isStatus(num)
        },
        getName: () => {
            return Child.getName()
        },
    }
}
