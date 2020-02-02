import React from 'react'

const Item = (props) => {
  const item = props.item
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
                        className="ui header PurchaseCardStyles__MainInfoNumberHeader-sc-3hfhop-2 kUCUnv">{item.id}</a>
                  </div>
                  <div
                    className="ui green tiny header StateIndicator-sc-2e7sf8-0 PurchaseCardStyles__MainInfoStateIndicator-sc-3hfhop-4 kQHlbB">
                    <i aria-hidden="true" className="circle small icon"></i>
                    <div className="content">Подача заявок</div>
                  </div>
                </div><a href="https://old.edu.upt24.ru/#/tenders/30867645"
                  className="ui header PurchaseCardStyles__MainInfoNameHeader-sc-3hfhop-6 fYuISf">{item['Наменование']}</a><a href="https://old.edu.upt24.ru/#/customers/1140769"
                  className="ui tiny header PurchaseCardStyles__MainInfoCustomerHeader-sc-3hfhop-7 kqHmbB">Государственное
                бюджетное учреждение города Москвы «Жилищник Таганского района» (ИНН: 7709966213)</a>
              </div>
              <div
                className="three wide computer two wide large screen twelve wide mobile twelve wide tablet column PaddedGridColumn-sc-13xlyn9-0 ktqTLU">
                <div className="ui tiny header PurchaseCardStyles__PriceInfoHeader-sc-3hfhop-10 jFaNRV">
                  Начальная цена</div>
                <div className="ui blue header PurchaseCardStyles__PriceInfoNumber-sc-3hfhop-11 fGtJCb">
                  2&nbsp;597&nbsp;466,91 ₽</div>
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
        </div>
      </div>
    </div>
  )
}

export default Item