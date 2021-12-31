function sendMail(params) {
    const tempParams = {
        name: document.getElementById('toName').value,
        message: document.getElementById('request').value
    }

    emailjs.send('gmail', 'template1', tempParams, 'user_zoqItUHbFib8GrZmQADoa')
        .then(function(res){
            console.log('success', res.status)
        })
}