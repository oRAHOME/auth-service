const bcrypt = require('bcrypt');

const mockUserData = [{
    name: 'Mark',
    password: 'password1',
    devices: [
        {name: 'switch', type: 'light', state: 'off'},
        {name: 'heater', type: 'heater', state: 'off'}
    ]},
    {
    name: 'Jill',
    password: 'password2',
    devices: [
        {name: 'switch', type: 'light', state: 'off'},
        {name: 'wifi', type: 'router', state: 'off'}
    ]}
];

(async () => {
    for (const user of mockUserData) {
        user.hashedPassword = await bcrypt.hash(user.password, 10);
        delete user.password;
    }
    console.log('Mock user data initialized:', mockUserData);
})();

module.exports = mockUserData;