import React, { Component } from 'react'
import './App.css'
import * as firebase from 'firebase'
import R from 'ramda'
const Loader = require('halogen/GridLoader');


const RatingButtonUp = (props) => {
  const fbResources = firebase.database().ref('resources')
  const btnId = props.id
  let newBtnValue = Number(props.ratingUp) + 1

  const handleClick = () => {
    fbResources.once('value', function(snap) {
      snap.forEach(function (childSnap) {
          const key = Number(childSnap.key)
          let temp
          if (btnId === key) {
              temp = key
              fbResources.child(temp).update({"ratingUp": newBtnValue}, function (err) {
                  if (err) {
                      console.error('god damn error is: ' + err);
                  } else {
                      console.log('updated fb-s resource: ' + childSnap.val().name + ' ratingUp.');
                  }
              })
          }
      })
    })
  }

  return <span>
    <i className="fa fa-thumbs-up" aria-hidden="true"></i>&nbsp;
    <button className="up btn btn-success"
            onClick={handleClick}
            id={`${props.ratingUpId}`}>{props.ratingUp}</button>
  </span>
}

const RatingButtonDown = (props) => {
  const fbResources = firebase.database().ref('resources')
  const btnId = props.id
  let newBtnValue = Number(props.ratingDown) + 1

  const handleClick = () => {
    fbResources.once('value', function(snap) {
      snap.forEach(function (childSnap) {
          const key = Number(childSnap.key)
          let temp
          if (btnId === key) {
              temp = key
              fbResources.child(temp).update({"ratingDown": newBtnValue}, function (err) {
                  if (err) {
                      console.error('god damn error is: ' + err);
                  } else {
                      console.log('updated fb-s resource: ' + childSnap.val().name + ' ratingDown.');
                  }
              })
          }
      })
    })
  }
  return <span>
    <i className="fa fa-thumbs-down" aria-hidden="true"></i>&nbsp;
    <button className="down btn btn-danger"
            onClick={handleClick}
            id={`${props.ratingDownId}`}>{props.ratingDown}</button>
  </span>
}

const Resource = (props) => {
    return <div className="row justify-content-md-center">
      <div className="entry col-lg-9  col-md-9 col-sm-10 text-center">
          <h1>{props.name}</h1>
          <p>{props.description}</p>
          <p>
              <a href={`${props.url}`} target="_blank">
                <img src={`${props.image}`} alt={`${props.name}`}  className="img-thumbnail loading-image preview"/>
              </a>
          </p>
          <div>
            <RatingButtonUp {...props} />&nbsp;&nbsp;&nbsp;
            <RatingButtonDown {...props} />
        </div>
      </div>
    </div>
}

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      resources: [],
      search: ''
    }
  }

  sortByLowest () {
    this.setState({
      resources: this.state.resources.sort((a, b) => {
        if (parseInt(a.ratingUp, 10) > parseInt(b.ratingUp, 10)) {return 1}
        else if (parseInt(a.ratingUp, 10) < parseInt(b.ratingUp, 10)) {return -1}
        else {
          if (parseInt(a.ratingDown, 10) < parseInt(b.ratingDown, 10)) {return 1}
          else if (parseInt(a.ratingDown, 10) > parseInt(b.ratingDown, 10)) {return -1}
          else return 0
        }
      })
    })
  }

  sortByHighest () {
    this.setState({
      resources: this.state.resources.sort((a, b) => {
        if (parseInt(a.ratingUp, 10) < parseInt(b.ratingUp, 10)) {return 1}
        else if (parseInt(a.ratingUp, 10) > parseInt(b.ratingUp, 10)) {return -1}
        else {
          if (parseInt(a.ratingDown, 10) > parseInt(b.ratingDown, 10)) {return 1}
          else if (parseInt(a.ratingDown, 10) < parseInt(b.ratingDown, 10)) {return -1}
          else return 0
        }
      })
    })
  }

  sortByName () {
    const sortByNameCaseInsensitive = R.sortBy(R.compose(R.toLower, R.prop('name')));
    const sortedResourceNames = sortByNameCaseInsensitive(this.state.resources)
    this.setState({
      resources: sortedResourceNames,
      search: ''
    })
  }

  updateSearch (e) {
    this.setState({
      search: e.target.value.substr(0, 20)
    })
  }

  componentDidMount () {
    const rootRef = firebase.database().ref('resources')
    rootRef.on("value", function(dataSnapshot) {
      this.setState({
        resources: dataSnapshot.val().sort((a, b) => {
          if (parseInt(a.ratingUp, 10) < parseInt(b.ratingUp, 10)) {return 1}
          else if (parseInt(a.ratingUp, 10) > parseInt(b.ratingUp, 10)) {return -1}
          else {
            if (parseInt(a.ratingDown, 10) > parseInt(b.ratingDown, 10)) {return 1}
            else if (parseInt(a.ratingDown, 10) < parseInt(b.ratingDown, 10)) {return -1}
            else return 0
          }
        }),
      })
    }.bind(this))
  }

  render() {
    let resources = this.state.resources
    let filteredResources = resources.filter(resource => {
      return resource.name.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1
    })

    return <div>

        <div className="jumbotron" style={{paddingBottom: "2rem"}}>
            <h1 className="text-center header">&lt;JSc(h)ool&gt;</h1>
            <p className="text-center lead header-text">JS developers, <b>(h)elp</b> others find the right path through the jungle and rate these online learning resources.</p>
            <p className="text-center lead header-text">Sort resources by: </p>
            <div className="text-center" style={{marginTop: "1.3rem"}}>
              <button className="btn btn-info" onClick={this.sortByName.bind(this)}>Name</button>&nbsp;&nbsp;
              <button className="up btn btn-success" onClick={this.sortByLowest.bind(this)}>Lowest Ratings</button>&nbsp;&nbsp;
              <button className="down btn btn-danger" onClick={this.sortByHighest.bind(this)}>Highest Ratings</button>&nbsp;&nbsp;
              <input className="search-input"
                     type="text"
                     placeholder="Search..."
                     value={this.state.search}
                     onChange={this.updateSearch.bind(this)} />
          </div>
        </div>

        <div className="container">
          <div className="row">
              <div className="col" id="page-header">
                  <h1 className="text-center" id="heading">Welcome to the JS and WebDev learning jungle!</h1>
              </div>
          </div>
      </div>

      {resources.length !== 0
      ? <div>
      {filteredResources
        .map(resource => {
          return <Resource key={resource.id} {...resource} />
        })
      }
      </div>
      : <span className="loader"><Loader color="#f0db4f" size="16px" margin="4px"/></span>}


      </div>
  }
}

export default App
