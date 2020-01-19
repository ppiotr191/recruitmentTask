
export default class UserAuth{

    setToken(apiToken){
        localStorage.setItem('apiToken', apiToken);
    }

    getToken(){
        return localStorage.getItem('apiToken');
    }

    setRoles(roles){
        localStorage.setItem('roles', JSON.stringify(roles));
    }

    getRoles(){
        let roles = localStorage.getItem('roles');
        if (!roles){
            return [];
        }
        return JSON.parse(roles);
    }

}