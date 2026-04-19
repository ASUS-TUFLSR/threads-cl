import {atom} from "recoil"

const authScreenAtom = atom({
    key: 'authScreenAuto',
    default: 'login',
});

export default authScreenAtom;