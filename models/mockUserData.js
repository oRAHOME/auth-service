const bcrypt = require('bcrypt');

const mockUserData = [{
    name: 'Mark',
    email: 'mark123@gmail.com',
    password: 'password1',
    devices: [
        {name: 'switch', type: 'light', state: 'off'},
        {name: 'heater', type: 'heater', state: 'off'}
    ]},
    {
    name: 'Jill',
    email: 'jill1994@gmail.com',
    password: 'password2',
    devices: [
        {name: 'switch', type: 'light', state: 'off'},
        {name: 'wifi', type: 'router', state: 'off'}
    ]}
];

const hashPasswords = async () => {
    for (const user of mockUserData) {
        user.hashedPassword = await bcrypt.hash(user.password, 10);
        delete user.password;
    }
    return mockUserData;
};

module.exports =  hashPasswords;