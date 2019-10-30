import React, { Component } from 'react';
import StockContainer from './StockContainer'
import PortfolioContainer from './PortfolioContainer'
import SearchBar from '../components/SearchBar'
const stockUrl = 'http://localhost:3000/stocks'

class MainContainer extends Component {
  constructor() {
    super();
    this.state = {
      stocks: [],
      portfolio: [],
      filter: false,
      filteredStocks: [],
      alpha: false,
      alphaStocks: [],
      priced: false,
      pricedStocks: []
    }
  }

  componentDidMount() {
    fetch(stockUrl)
    .then(resp => resp.json())
    .then(stocks => this.setState({stocks}))
  }

  addStock = (stock) => {
    let changedPortfolio = this.state.portfolio.slice();
    if (!changedPortfolio.includes(stock.id)) {
      changedPortfolio.push(stock.id)
      this.setState({portfolio: changedPortfolio})
    }
  }

  removeFromPortfolio = remStock => {
    let changedPortfolio = this.state.portfolio.filter(id => {
      if (id !== remStock.id)
        return true
    })
    this.setState({portfolio: changedPortfolio})
  }

  filterStocks = e => {

    let filteredStocks = this.state.stocks.slice().filter(oldStock => oldStock.type === e.target.value)
    this.setState({
      filter: true,
      filteredStocks: filteredStocks
     })
  }

  sortStocks = e => {

    if (e.target.value === "Price") {
      let sorted = this.state.stocks.slice().sort(function(a,b) {return a.price - b.price}  )
      this.setState({
        priced: true,
        pricedStocks: sorted,
        alpha: false
      })
    } else if (e.target.value === "Alphabetically") {
      let alphad = this.state.stocks.slice().sort(function(a, b){
        var x = a.ticker.toLowerCase();
        var y = b.ticker.toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
      })
      this.setState({
        alpha: true,
        alphaStocks: alphad,
        priced: false
      })
    }

  }

  render() {
    let whichStocks = this.state.stocks;
    if (this.state.filter) {
      whichStocks = this.state.filteredStocks
    } else if (this.state.priced) {
      whichStocks = this.state.pricedStocks
    } else if (this.state.alpha) {
      whichStocks = this.state.alphaStocks
    }

    return (
      <div>
        <SearchBar
        filterStocks={this.filterStocks}
        sortStocks={this.sortStocks}
        alpha={this.state.alpha}
        priced={this.state.priced}
        />

          <div className="row">
            <div className="col-8">

              <StockContainer
              stocks={ whichStocks }
              addStock={this.addStock} />

            </div>
            <div className="col-4">

              <PortfolioContainer  stocks={this.state.stocks} myStocks={this.state.portfolio} removeStock={this.removeFromPortfolio}/>

            </div>
          </div>
      </div>
    );
  }

}

export default MainContainer;
