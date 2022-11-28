if(document.querySelector('.card_number')) {

    var card_number = new Cleave('.card_number', {
        creditCard: true,
        onCreditCardTypeChanged: function (type) {
            // update UI ...
        }
    })
}


if(document.querySelector('.card_document')) {
    var card_document = new Cleave('.card_document', {
        delimiters: ['.', '.', '-'],
        blocks: [3, 3, 3, 2],
        uppercase: true
    })
}


if(document.querySelector('.card_validity')) {
    var card_validity = new Cleave('.card_validity', {
        delimiters: ['/'],
        blocks: [2, 2],
        uppercase: true
    })
}
