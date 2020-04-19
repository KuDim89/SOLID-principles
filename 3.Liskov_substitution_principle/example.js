class Person {}

class Member extends Person{
    access() {
        console.log('You have access!');
    }
}

class Guest extends Person {
    isGuest = true;
}

class Frontend extends Member {
    canCreateFrontend() {}
}

class Backend extends Member {
    canCreateBackend() {}
}

class Pilot extends Guest {
    access() {
        throw new Error("You don't have access!" )
    }
}

function openSecretDoor(member) {
    member.access()
}

openSecretDoor(new Frontend());
openSecretDoor(new Backend());
//openSecretDoor(new Pilot()); // There should be member!


//====================================================================================================================

class Component {
    isComponent = true;
}

class ComponentWithTemplate extends Component{
    render() {
        return `<div>Component</div>`
    }
}

class HightOrderComponent extends Component{

}

class HederComponent extends ComponentWithTemplate {
    onInit() {}
}

class FooterComponent extends ComponentWithTemplate {
    afterInit() {}
}

class HOC extends HightOrderComponent {
    render () {
        throw new Error('Render is impossible here');
    }

    wrapComponent(component) {
        component.wrapped = true;
        return component
    }
}

class Render {
    constructor(component) {
        this.component = component;
    }

    renderComponent() {
        this.component.render();
    }
}

const header = new Render(new HederComponent().render());
const footer = new Render(new FooterComponent().render());

console.log(header.component);
console.log(footer.component);


