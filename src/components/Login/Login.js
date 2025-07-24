export default {
    data() {
        return {
            email: '',
            password:''
        }
    },
    methods: {
        async handleLogin() {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: this.email,
                    password: this.password
                })
                
            })
            console.log("sending Data",JSON.stringify({
                email: this.email,
                password: this.password
            }))
            if (!response.ok) {
                const err = await response.json()
                console.log("Login Failed",err.message)
            }
            const data = await response.json()
            console.log("User Logged In",data.user)
            const token = data.token;
            localStorage.setItem('token', token);
            // this.$router.push('/')
        }
    }
}