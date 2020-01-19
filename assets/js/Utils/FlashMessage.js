
export default class FlashMessage{

    constructor() {
        this.flashMessage = '';
    }

    setFlash(flashMessage){
        this.flashMessage = flashMessage;
    }

    getFlash(){
        const flashMessage = this.flashMessage;
        this.flashMessage = '';
        return flashMessage;
    }
}