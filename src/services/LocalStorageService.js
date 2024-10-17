class LocalStorageService {
    constructor() {
        this.ls = window.localStorage;
    }

    removeItem(key) {
        this.ls.removeItem(key);
    }

    setItem(key, value) {
        try {
            const JSONvalue = JSON.stringify(value);
            this.ls.setItem(key, JSONvalue);
            return true;
        } catch (error) {
            console.log(`Error setting item from localStorage: ${error}`);
            return null;
        }
    }

    getItem(key) {
        try {
            let value = this.ls.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.log(`Error getting item from localStorage: ${error}`);
            return null;
        }
    }

    clear(){
        this.ls.clear();
    }

}

export default new LocalStorageService;