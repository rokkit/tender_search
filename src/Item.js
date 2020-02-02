import React, {useState} from 'react'

import Collapse from "@kunukn/react-collapse";

const Item = (props) => {
  const item = props.item

  const [isRecommendShow, setIsRecommendShow] = useState(false)

  const recommendStyle = {
    marginLeft: 'auto',
    marginRight: 0,
    borderBottom: '1px dashed',
    '&:hover': {
      cursor: 'pointer'
    }
  }



  const toggleRecommended = () => {
    setIsRecommendShow(!isRecommendShow)
  }
  return (
    <div className="ui container PurchaseListStyles__ListContainer-fk0ehb-0 csANJA">
      <div className="PurchaseListStyles__CardContainer-fk0ehb-2 MwjUe">
        <div className="PurchaseCardStyles__MainInfoContainer-sc-3hfhop-0 hOboTe">
          <div className="ui grid">
            <div className="row">
              <div
                className="nine wide computer ten wide large screen twelve wide mobile twelve wide tablet column">
                <div
                  className="PurchaseCardStyles__FlexContainer-sc-3hfhop-3 PurchaseCardStyles__MainInfoTopInfoContainer-sc-3hfhop-5 eHFShC">
                  <div className="PurchaseCardStyles__FlexContainer-sc-3hfhop-3 kUzFDy">
                    <div className="ui tiny header PurchaseCardStyles__MainInfoTypeHeader-sc-3hfhop-1 laeZxS">
                      <img alt="" src="/static/tender_card_type_icon.svg" className="ui image" />
                      <div className="content">Закупка 44-ФЗ и 223-ФЗ</div>
                    </div><a href="https://old.edu.upt24.ru/#/tenders/30867645"
                        className="ui header PurchaseCardStyles__MainInfoNumberHeader-sc-3hfhop-2 kUCUnv">{item['Id']}</a>
                  </div>
                  <div
                    className="ui green tiny header StateIndicator-sc-2e7sf8-0 PurchaseCardStyles__MainInfoStateIndicator-sc-3hfhop-4 kQHlbB">
                    <i aria-hidden="true" className="circle small icon"></i>
                    <div className="content">Подача заявок</div>
                  </div>
                </div><a href="https://old.edu.upt24.ru/#/tenders/30867645"
                  className="ui header PurchaseCardStyles__MainInfoNameHeader-sc-3hfhop-6 fYuISf">{item['Наменование']}</a><a href="https://old.edu.upt24.ru/#/customers/1140769"
        className="ui tiny header PurchaseCardStyles__MainInfoCustomerHeader-sc-3hfhop-7 kqHmbB">{item['Производитель']}</a>
              </div>
              <div
                className="three wide computer two wide large screen twelve wide mobile twelve wide tablet column PaddedGridColumn-sc-13xlyn9-0 ktqTLU">
                <div className="ui tiny header PurchaseCardStyles__PriceInfoHeader-sc-3hfhop-10 jFaNRV">
                  Начальная цена</div>
                <div className="ui blue header PurchaseCardStyles__PriceInfoNumber-sc-3hfhop-11 fGtJCb">
                  2&nbsp;466,91 ₽</div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="PurchaseCardStyles__FlexContainer-sc-3hfhop-3 PurchaseCardStyles__AdditionalInfoContainer-sc-3hfhop-8 WvgkG">
          <div className="ui tiny header PurchaseCardStyles__AdditionalInfoHeader-sc-3hfhop-9 bJYKTf"><img
            alt=""
            src="/static/location_icon.svg" className="ui image" />
            <div className="content">г Москва</div>
          </div>
          <div className="ui tiny header PurchaseCardStyles__AdditionalInfoHeader-sc-3hfhop-9 bJYKTf"><img
            alt=""
            src="/static/federalLaw_icon.svg" className="ui image" />
            <div className="content">44-ФЗ</div>
          </div>
          <div className="ui tiny header PurchaseCardStyles__AdditionalInfoHeader-sc-3hfhop-9 bJYKTf"><img
            alt=""
            src="/static/calendar_icon.svg" className="ui image" />
            <div className="content">до 29.01.2020</div>
          </div>
          <div onClick={toggleRecommended} className="recommendLink" style={recommendStyle}>
            Рекомендовано, с этим товаром
          </div>
        </div>
        <Recommend isOpen={isRecommendShow} />
      </div>
    </div>
  )
}

const Recommend = (props) => {
  const recommendedStyles = {
    minWidth: 100,
    backgroundColor: 'rgb(255, 255, 255)',
    padding: '20px 47px'
  }

  const elStyle = {
    marginBottom: 10,
    display: 'inline-block',
    verticalAlign: 'top',
    marginLeft: 20,
    backgroundColor: 'rgb(255, 255, 255)',

    color: 'rgb(153, 153, 153)',
    fontSize: 15,
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: '10px 10px 10px 10px',
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 3px 4px',
    borderTop: '2px solid rgb(241, 241, 241)',
    borderLeft: '2px solid rgb(241, 241, 241)',
    borderRight: '2px solid rgb(241, 241, 241)',
    borderBottom: '2px solid rgb(241, 241, 241)',
    textAlign: 'center',
    padding: 10,
    cursor: 'pointer'
  }
  return (
    <Collapse isOpen={props.isOpen} transition={`height 250ms cubic-bezier(.4, 0, .2, 1)`}>
    <div style={recommendedStyles}>
      <ul>
        <li style={elStyle}>
          <a href="#">Winner Electronics WR-111 электрический чайник</a>
          <p>1000 ₽</p>
        </li>
        <li style={elStyle}>
          <a href="#">Вареник</a>
          <p>500 ₽</p>
        </li>
      </ul>
    </div>
    </Collapse>
  )
}

export default Item