import React, {Component} from 'react';

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        let randomSentence = this.giveRandomSentence();
        this.setState({ randomSentence })
    }

    giveRandomSentence() {
        const welcomeSentences = [
            `Hey ${this.props.firstName}, having a good time in Berlin?`,
            `Hey ${this.props.firstName}, it's nice to have you back!`,
            `Hey ${this.props.firstName}, having a good time in Berlin?`,
            `Hello there ${this.props.firstName}, looking good today!`,
            `Sup ${this.props.firstName}? Hope Berlin is treating you right`,
            `Yo ${this.props.firstName}, do you feel like a Döner? I do.`,
            
        ];
        const getRandomNumber = (min, max) => {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min;
        };
        return welcomeSentences[getRandomNumber(0, welcomeSentences.length)];
    }

    render() {
        return (
            <div id="homepage">
                <h2>{this.state.randomSentence}</h2>
                <img src="/public/assets/BerlinSparks.jpg"/>
            </div>
        )
    }
}

export default HomePage;
