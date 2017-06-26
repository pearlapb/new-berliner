import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router';

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        axios.get('/getAllUserNames').then((res) => {
            this.setState({ usernames: res.data.usernames });
        })
    }

    updateSearch(e) {
        let usernames = this.state.usernames, searchName = e.target.value;
        if (searchName.length > 0) {
            if (this.state.searchList && this.state.searchList.length == 1) {
                return;
            } else {
                let matches = [], idsOfMatches = [];
                for (var i = 0; i < usernames.length; i++) {
                    if (usernames[i].indexOf(searchName) == 0) {
                        matches.push(usernames[i]);
                        idsOfMatches.push(i + 1);
                    }
                }
                axios.post('/getProfileSearchSummaries', idsOfMatches).then((res) => {
                    this.setState({ searchList: res.data.results })
                }).catch((err) => {
                    console.log(err);
                })
            }
        } else {
            this.setState({ searchList: false })
        }
    }

    clearSearch(e) {
        this.setState({ searchList: false })
    }

    render() {
        let searchList = "";
        if (this.state.searchList) {
            searchList = this.state.searchList.map((item) => {
                return (
                    <li className="search-result">
                        <Link to={item.userUrl} onClick={this.clearSearch.bind(this)}><img src={item.imageUrl}/></Link>
                        <p key={item.name}>{item.name}</p>
                    </li>
                )
            })
        }
        return (
            <div id="search-bar-wrapper">
                <input id="search-bar" placeholder="Search for new friends in Berlin" type="text" value={this.state.search} onClick={this.clearSearch.bind(this)} onChange={this.updateSearch.bind(this)}/>
                <ul id="all-results">
                    {searchList}
                </ul>
            </div>
        )
    }

}

export default SearchBar;
