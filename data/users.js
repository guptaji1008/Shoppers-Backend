import bcrypt from 'bcrypt'

const users = [
    {
        name: "Aman Gupta",
        email: "aman@gmail.com",
        password: bcrypt.hashSync('123456789', 10),
        isAdmin: true,
    },
    {
        name: "Anuj Gupta",
        email: "anuj@gmail.com",
        password: bcrypt.hashSync('123456789', 10),
        isAdmin: false,
    },
    {
        name: "Shefali Gupta",
        email: "shefali@gmail.com",
        password: bcrypt.hashSync('123456789', 10),
        isAdmin: false,
    },
    {
        name: "Vineet Gupta",
        email: "vineet@gmail.com",
        password: bcrypt.hashSync('123456789', 10),
        isAdmin: false,
    },
]

export default users