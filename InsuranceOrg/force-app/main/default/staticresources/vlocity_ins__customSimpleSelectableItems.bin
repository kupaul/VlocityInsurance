<apex:component >
  <style>
        /* Compare Modal Styles: */
        .vlocity .modal-content {
            -webkit-border-radius: 0;
            border-radius: 0;
            border: none;
            -webkit-box-shadow: none;
            box-shadow: none
        }
        .vlocity.vlcCompareModal * {
            -webkit-transition: all 100ms ease-in;
            transition: all 100ms ease-in
        }
        .vlocity.vlcCompareModal a:hover,
        .vlocity.vlcCompareModal a:active,
        .vlocity.vlcCompareModal a:focus,
        .vlocity.vlcCompareModal a:visited {
            text-decoration: none
        }
        .vlocity.vlcCompareModal .modal-header {
            border: none;
            -webkit-border-radius: 0;
            border-radius: 0;
            min-height: 0;
            padding: 23px 22px 0
        }
        .vlocity.vlcCompareModal .modal-header .form-group {
            display: inline-block;
            margin: 0
        }
        .vlocity.vlcCompareModal .modal-header .form-group select.form-control {
            position: relative;
            top: -3px;
            margin-left: 10px;
            width: 172px;
            display: inline-block;
            background-image: -webkit-linear-gradient(top, rgba(1, 1, 1, 0) 0, rgba(0, 0, 0, .05) 100%);
            background-image: -webkit-gradient(linear, left top, left bottom, from(rgba(1, 1, 1, 0)), to(rgba(0, 0, 0, .05)));
            background-image: linear-gradient(to bottom, rgba(1, 1, 1, 0) 0, rgba(0, 0, 0, .05) 100%);
            -webkit-appearance: menulist;
            -moz-appearance: menulist;
            appearance: menulist
        }
        .vlocity.vlcCompareModal .modal-header i.icon {
            font-size: 26px;
            line-height: 28px;
            cursor: pointer
        }
        .vlocity.vlcCompareModal .modal-header i.icon:before {
            margin: 0
        }
        .vlocity.vlcCompareModal .modal-body {
            padding: 23px 22px 22px
        }
        .vlocity.vlcCompareModal .modal-body .table > tbody > tr > td {
            overflow: visible;
            text-overflow: clip;
            white-space: normal;
        }
        .vlocity.vlcCompareModal .table-wrapper {
            -webkit-border-radius: 4px;
            border-radius: 4px;
            background: #fff
        }
        .vlocity.vlcCompareModal table.table {
            border: none;
            margin: 0
        }
        .vlocity.vlcCompareModal table.table thead tr th {
            background: transparent;
            border: none;
            padding: 5px 8px;
            border-bottom: 1px solid #dedede;
            border-right: 1px solid #dedede;
            vertical-align: middle
        }
        .vlocity.vlcCompareModal table.table thead tr th:last-of-type {
            border-right: none
        }
        .vlocity.vlcCompareModal table.table thead tr th:not(:first-of-type) {
            text-align: center
        }
        .vlocity.vlcCompareModal table.table thead tr th div {
            background: transparent
        }
        .vlocity.vlcCompareModal table.table thead tr:last-of-type th {
            border-bottom: none
        }
        .vlocity.vlcCompareModal table.table tbody tr.attr-category td {
            border-bottom: none
        }
        .vlocity.vlcCompareModal table.table tbody tr:hover {
            cursor: auto
        }
        .vlocity.vlcCompareModal table.table tbody tr:nth-of-type(even),
        .vlocity.vlcCompareModal table.table tbody tr:nth-of-type(odd) {
            background-color: transparent
        }
        .vlocity.vlcCompareModal table.table tbody tr td {
            border: none;
            padding: 5px 8px;
            border-bottom: 1px solid #dedede;
            border-right: 1px solid #dedede;
            vertical-align: middle
        }
        .vlocity.vlcCompareModal table.table tbody tr td:not(:first-of-type) {
            text-align: center
        }
        .vlocity.vlcCompareModal table.table tbody tr td:last-of-type {
            border-right: none
        }
        .vlocity.vlcCompareModal table.table tbody tr td.currency.no-currency-symbol span.value:before {
            content: "$";
            display: inline;
            position: relative;
            left: 3px
        }
        .vlocity.vlcCompareModal table.table tbody tr td.currency .currency-symbol {
            position: relative;
            left: 3px
        }
        .vlocity.vlcCompareModal table.table tbody tr td.currency span.value {
            padding-right: 5px
        }
        .vlocity.vlcCompareModal table.table tbody tr td.percent span.value:after {
            content: "%";
            display: inline;
            position: relative;
            left: -3px
        }
        .vlocity.vlcCompareModal table.table tbody tr:last-of-type td {
            border-bottom: none
        }
        .vlocity.vlcCompareModal table.table tbody+tbody {
            border: none
        }
        .vlocity.vlcCompareModal table.table tfoot tr td {
            background: transparent;
            padding: 5px 8px
        }
        .vlocity.vlcCompareModal table.table tfoot tr td div {
            background: transparent
        }
        .vlocity.vlcCompareModal table.table.ng-table thead tr th {
            background: transparent
        }
        .vlocity.vlcCompareModal table.table.ng-table thead tr th div {
            background: transparent
        }
        .vlocity.vlcCompareModal table.table.ng-table tfoot tr td {
            background: transparent
        }
        .vlocity.vlcCompareModal table.table.ng-table tfoot tr td div {
            background: transparent
        }
        .vlocity.vlcCompareModal label.modal-title,
        .vlocity.vlcCompareModal h2 {
            font-size: 16px;
            font-weight: 700;
            color: #000;
            line-height: 28px
        }
        .vlocity.vlcCompareModal h2 {
            margin: 9px 0;
            line-height: 20px
        }
        .vlocity.vlcCompareModal h3 {
            font-weight: 700;
            margin: 0
        }
        .vlocity.vlcCompareModal * {
            font: normal 400 12px/18px Arial, sans-serif
        }
        .vlocity.vlcCompareModal .modal-header {
            background: #f2f2f2
        }
        .vlocity.vlcCompareModal .modal-header i.icon {
            color: #05a6df
        }
        .vlocity.vlcCompareModal .modal-header i.icon:hover {
            color: #048cbc
        }
        .vlocity.vlcCompareModal .modal-body {
            background: #f2f2f2
        }
        .vlocity.vlcCompareModal .table-wrapper {
            border: 1px solid #c7c7c7
        }
        .vlocity.vlcCompareModal table.table thead tr th {
            border-color: #dedede
        }
        .vlocity.vlcCompareModal table.table tbody tr.attr-category td {
            background: #f2f2f2
        }
        .vlocity.vlcCompareModal table.table tbody tr td {
            border-color: #dedede
        }
        .vlocity.vlcCompareModal label.modal-title,
        .vlocity.vlcCompareModal h2 {
            font-size: 16px;
            font-weight: 700;
            color: #000;
            line-height: 28px
        }
        .vlocity.vlcCompareModal h2 {
            line-height: 20px
        }
        .vlocity.vlcCompareModal h3 {
            font: normal 400 12px/18px Arial, sans-serif;
            font-weight: 700;
            margin: 0
        }
        
        
        /* Selectible items styles: */     
        .vlocity .carousel-control.left,
        .vlocity .carousel-control.right {
            background: none
        }
        .vlocity .outer-container {
            width: 100%;
            max-width: 850px
        }
        .vlocity li {
            margin-left: 0;
        }
        .vlocity .outer-container .row.form-inline.form-group label.filter-title {
            display: block;
            margin-top: 10px
        }
        .vlocity .outer-container .row.form-inline.form-group select.form-control {
            width: 100%;
            -webkit-appearance: menulist;
            -moz-appearance: menulist;
            appearance: menulist
        }
        .vlocity .outer-container .row.form-inline.form-group .btn {
            margin-top: 27px
        }
        .vlocity .outer-container .scroll-container {
            margin: 10px 0;
            overflow-x: scroll;
            background-color: #ededed;
            border: 1px solid #d8d8d8;
            padding: 0 0 10px 20px
        }
        .vlocity .outer-container .products-container {
            padding-right: 20px
        }
        .vlocity .outer-container .products-container:before,
        .vlocity .outer-container .products-container:after {
            content: " ";
            display: table
        }
        .vlocity .outer-container .products-container:after {
            clear: both
        }
        .vlocity .outer-container .section-wrapper {
            float: left;
        }
        .vlocity .outer-container section.selectable-hphc {
            width: 275px;
            float: left;
            background: white;
            -webkit-box-shadow: 0 2px 2px rgba(0, 0, 0, .1);
            box-shadow: 0 2px 2px rgba(0, 0, 0, .1);
            margin: 30px 6px 20px;
            border: 1px solid #ededed
        }
        .vlocity .outer-container section.selectable-hphc .top-container {
            background-color: #f8f8f8;
            padding-bottom: 12px;
            border: 1px solid #f8f8f8;
            border-bottom: 1px solid #ededed;
            -webkit-transition: all 100ms ease-in;
            transition: all 100ms ease-in
        }
        .vlocity .outer-container section.selectable-hphc h1 {
            padding-top: 15px;
            font-size: 16px;
            line-height: 22px;
            padding: 15px 15px 0;
            font-weight: 700;
            text-align: center;
            margin: 0;
            min-height: 60px
        }
        .vlocity .outer-container section.selectable-hphc .subtotal {
            display: block;
            margin: 10px 0 15px;
            text-align: center;
            position: relative
        }
        .vlocity .outer-container section.selectable-hphc .subtotal sup {
            position: absolute;
            font-size: 14px;
            top: 14px;
            margin-left: -10px
        }
        .vlocity .outer-container section.selectable-hphc .subtotal span.num {
            font-size: 34px
        }
        .vlocity .outer-container section.selectable-hphc .subtotal span.per {
            text-transform: uppercase;
            color: #aeaeae;
            letter-spacing: .05em
        }
        .vlocity .outer-container section.selectable-hphc .subtotal span.label-text {
            display: block;
            text-align: center;
            color: #aeaeae;
            font-size: 11px
        }
        .vlocity .outer-container section.selectable-hphc button.form-control {
            width: 75%;
            margin: 0 auto;
            height: 32px;
            background-color: white;
            border: 1px solid #04a6df;
            -webkit-transition: all 100ms ease-in;
            transition: all 100ms ease-in
        }
        .vlocity .outer-container section.selectable-hphc button.form-control span {
            color: #04a6df;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 11px
        }
        .vlocity .outer-container section.selectable-hphc button.form-control:hover {
            background-color: #04a6df
        }
        .vlocity .outer-container section.selectable-hphc button.form-control:hover span {
            color: white
        }
        .vlocity .outer-container section.selectable-hphc .checkbox {
            text-align: center;
            margin-bottom: 0
        }
        .vlocity .outer-container section.selectable-hphc .checkbox label {
            color: #aeaeae;
            font-size: 11px;
            line-height: 15px
        }
        .vlocity .outer-container section.selectable-hphc .checkbox input[type=checkbox] {
            -moz-appearance: none;
            -webkit-appearance: none;
            appearance: none;
            width: 13px;
            height: 13px;
            background-color: white;
            border: 1px solid #aeaeae
        }
        .vlocity .outer-container section.selectable-hphc .checkbox input[type=checkbox]:checked {
            border-color: #05a6df
        }
        .vlocity .outer-container section.selectable-hphc .checkbox input[type=checkbox]:checked:after {
            content: "\e809";
            font-family: fontello;
            font-size: 13px;
            color: #05a6df;
            font-weight: 700;
            position: relative;
            top: -1px;
            left: -1px
        }
        .vlocity .outer-container section.selectable-hphc .checkbox input[type=checkbox]:focus,
        .vlocity .outer-container section.selectable-hphc .checkbox input[type=checkbox]:active {
            outline: 0
        }
        .vlocity .outer-container section.selectable-hphc a.external-link {
            text-align: center;
            display: inline-block;
            width: 100%;
            margin: 8px 0 0;
            font-size: 11px
        }
        .vlocity .outer-container section.selectable-hphc .attributes-container {
            background-color: white;
            padding: 10px 30px;
            position: relative;
            border: 1px solid white;
            border-top: none;
            -webkit-transition: all 100ms ease-in;
            transition: all 100ms ease-in
        }
        .vlocity .outer-container section.selectable-hphc .attributes-container h3 {
            text-transform: uppercase;
            font-size: 12px;
            font-weight: 700;
            text-align: center;
            margin-top: 5px
        }
        .vlocity .outer-container section.selectable-hphc .attributes-container strong {
            font-size: 11px;
            line-height: 14px;
            margin: 5px 0;
            display: inline-block;
        }
        .vlocity .outer-container section.selectable-hphc .attributes-container ul {
            list-style: none;
            padding: 0;
            margin: 0
        }
        .vlocity .outer-container section.selectable-hphc .attributes-container ul li {
            text-align: center
        }
        .vlocity .outer-container section.selectable-hphc .attributes-container ul li p.percent:after {
            content: "%";
            display: inline;
            position: relative;
            left: -3px
        }
        .vlocity .outer-container section.selectable-hphc .attributes-container ul li p.currency .currency-symbol {
            position: relative;
            left: 2px
        }
        .vlocity .outer-container section.selectable-hphc .attributes-container ul.included-attributes {
            margin-bottom: 15px
        }
        .vlocity .outer-container section.selectable-hphc .attributes-container ul.included-attributes li {
            color: #aeaeae;
            display: block;
            line-height: 16px;
            text-align: center
        }
        .vlocity .outer-container section.selectable-hphc .attributes-container ul.specific-prices {
            margin: 0
        }
        .vlocity .outer-container section.selectable-hphc .attributes-container ul.specific-prices.align-bottom {
            position: absolute;
            bottom: 15px;
            left: 0;
            width: 100%
        }
        .vlocity .outer-container section.selectable-hphc .attributes-container ul.specific-prices li {
            margin-bottom: 10px;
            text-align: left
        }
        .vlocity .outer-container section.selectable-hphc .attributes-container ul.specific-prices li:after {
            content: "";
            display: table;
            clear: both
        }
        .vlocity .outer-container section.selectable-hphc .attributes-container ul.specific-prices li strong {
            display: inline-block;
            float: left;
            padding-left: 20px
        }
        .vlocity .outer-container section.selectable-hphc .attributes-container ul.specific-prices li p {
            display: inline-block;
            float: right;
            color: #aeaeae;
            padding-right: 20px;
            line-height: 18px
        }
        .vlocity .outer-container section.selectable-hphc .attributes-container ul.specific-prices li:last-of-type {
            margin-bottom: 0
        }
        .vlocity .outer-container section.selectable-hphc.recommended .top-container {
            position: relative;
            background-color: #04a6df;
            border-color: #04a6df
        }
        .vlocity .outer-container section.selectable-hphc.recommended .top-container:before {
            content: "We Recommend";
            text-transform: uppercase;
            position: absolute;
            top: -18px;
            left: 0;
            font-size: 9px;
            font-weight: 700;
            color: #04a6df;
            letter-spacing: .05em;
            display: inline-block;
            width: 100%;
            text-align: center
        }
        .vlocity .outer-container section.selectable-hphc.recommended .top-container h1 {
            color: white
        }
        .vlocity .outer-container section.selectable-hphc.recommended .top-container .subtotal {
            color: white
        }
        .vlocity .outer-container section.selectable-hphc.recommended .top-container .subtotal sup {
            color: white
        }
        .vlocity .outer-container section.selectable-hphc.recommended .top-container .subtotal span.num {
            color: white
        }
        .vlocity .outer-container section.selectable-hphc.recommended .top-container .subtotal span.per {
            color: #000
        }
        .vlocity .outer-container section.selectable-hphc.recommended .top-container .subtotal span.label-text {
            display: block;
            text-align: center;
            color: #e5f8fe
        }
        .vlocity .outer-container section.selectable-hphc.recommended .top-container button.form-control {
            background-color: transparent;
            border-color: white
        }
        .vlocity .outer-container section.selectable-hphc.recommended .top-container button.form-control span {
            color: white
        }
        .vlocity .outer-container section.selectable-hphc.recommended .top-container button.form-control:hover {
            background-color: white;
            -webkit-box-shadow: none;
            box-shadow: none
        }
        .vlocity .outer-container section.selectable-hphc.recommended .top-container button.form-control:hover span {
            color: #04a6df
        }
        .vlocity .outer-container section.selectable-hphc.recommended .top-container .checkbox label {
            color: #e5f8fe
        }
        .vlocity .outer-container section.selectable-hphc.recommended .top-container .checkbox input[type=checkbox] {
            border: none
        }
        .vlocity .outer-container section.selectable-hphc.recommended .top-container .checkbox input[type=checkbox]:checked:after {
            left: 0;
            top: 0
        }
        .vlocity .outer-container section.selectable-hphc.recommended.vlc-selectableitem-selected .top-container .checkbox input[type=checkbox] {
            border: 1px solid #aeaeae
        }
        .vlocity .outer-container section.selectable-hphc.recommended.vlc-selectableitem-selected .top-container .checkbox label {
            color: #aeaeae
        }
        .vlocity .outer-container section.selectable-hphc.vlc-selectableitem-selected .top-container,
        .vlocity .outer-container section.selectable-hphc.vlc-selectableitem-selected .attributes-container {
            border-color: #2a5
        }
        .vlocity .outer-container section.selectable-hphc.vlc-selectableitem-selected .top-container {
            background-color: #e3f1e8
        }
        .vlocity .outer-container section.selectable-hphc.vlc-selectableitem-selected.recommended .top-container h1 {
            color: #000
        }
        .vlocity .outer-container section.selectable-hphc.vlc-selectableitem-selected.recommended .top-container .subtotal {
            color: #000
        }
        .vlocity .outer-container section.selectable-hphc.vlc-selectableitem-selected.recommended .top-container .subtotal sup {
            color: #000
        }
        .vlocity .outer-container section.selectable-hphc.vlc-selectableitem-selected.recommended .top-container .subtotal span.num {
            color: #000
        }
        .vlocity .outer-container section.selectable-hphc.vlc-selectableitem-selected.recommended .top-container .subtotal span.per {
            color: #aeaeae
        }
        .vlocity .outer-container section.selectable-hphc.vlc-selectableitem-selected.recommended .top-container button.form-control {
            background-color: #2a5;
            border-color: #2a5
        }
        .vlocity .outer-container section.selectable-hphc.vlc-selectableitem-selected.recommended .top-container button.form-control span {
            color: white
        }
        .vlocity .outer-container section.selectable-hphc.vlc-selectableitem-selected.recommended .top-container button.form-control:hover {
            background-color: #1e954a;
            border-color: #1e954a;
            -webkit-box-shadow: none;
            box-shadow: none
        }
        .vlocity .outer-container section.selectable-hphc.vlc-selectableitem-selected.recommended .top-container button.form-control:hover span {
            color: white
        }
        .vlocity .outer-container section.selectable-hphc.vlc-selectableitem-selected button.form-control {
            background-color: #2a5;
            border-color: #2a5;
            white-space: nowrap;
            overflow: hidden;
            -webkit-box-shadow: none;
            box-shadow: none
        }
        .vlocity .outer-container section.selectable-hphc.vlc-selectableitem-selected button.form-control span {
            color: white
        }
        .vlocity .outer-container section.selectable-hphc.vlc-selectableitem-selected button.form-control span.selected {
            padding-left: 15px;
            position: relative;
        }
        .vlocity .outer-container section.selectable-hphc.vlc-selectableitem-selected button.form-control span i.icon {
            color: white;
            font-size: 17px;
            position: absolute;
            left: -6px;
            top: -6px;
            z-index: 1;
            text-indent: initial
        }
        .vlocity .outer-container section.selectable-hphc.vlc-selectableitem-selected button.form-control span i.icon:hover:before {
            content: "\e842"
        }
        .vlocity .outer-container section.selectable-hphc.vlc-selectableitem-selected button.form-control:hover {
            background-color: #1e954a;
            border-color: #1e954a
        }
        .vlocity .outer-container.hphc * {
            font-family: Verdana, Arial, sans-serif
        }
        .vlocity .outer-container.hphc a {
            color: #f18614
        }
        .vlocity .outer-container.hphc a:hover {
            color: #c66c0c
        }
        .vlocity .outer-container.hphc .form-control,
        .vlocity .outer-container.hphc .btn {
            line-height: 1.5
        }
        .vlocity .outer-container.hphc .scroll-container {
            background-color: #e6e4d9;
            border-color: #dedccc
        }
        .vlocity .outer-container.hphc section.selectable-hphc:not(.vlc-selectableitem-selected) .top-container {
            background-color: #eeede5;
            border-color: #eeede5
        }
        .vlocity .outer-container.hphc section.selectable-hphc {
            border-color: #dedccc
        }
        .vlocity .outer-container.hphc section.selectable-hphc .subtotal {
            margin-top: 6px
        }
        .vlocity .outer-container.hphc section.selectable-hphc .subtotal span.num {
            letter-spacing: -.05em
        }
        .vlocity .outer-container.hphc section.selectable-hphc .attributes-container strong {
            line-height: 15px;
            margin-bottom: 2px;
            display: inline-block
        }
        .vlocity .outer-container.hphc section.selectable-hphc .attributes-container p span {
            font-size: 11px
        }
    </style>  
    <script type="text/ng-template" id="vlcCompareModal.html">
        <div class="vlocity vlcCompareModal hphc">
            <div class="modal-header form-inline">
                <div class="form-group">
                    <label for="compareSelect" class="modal-title">Compare Plans</label>
                    <select id="compareSelect" ng-model="selectedCC" class="form-control" ng-options="category for category in categoryList" ng-change="selectedItemChanged(selectedCC)">
                        <option value="">All</option>
                    </select>
                </div>
                <i class="icon icon-v-close-circle-line pull-right" ng-click="cancel()"></i>
            </div>
            <div class="modal-body">
                <div class="table-wrapper">
                    <table class="table">
                        <thead>
                            <tr>
                                <th></th>
                                <th ng-repeat="product in productList">
                                    <h2>{{product.name}}</h2></th>
                            </tr>
                        </thead>
                        <tbody ng-repeat="category in categoryList" ng-if="showCategory(category)">
                            <tr class="attr-category">
                                <td ng-attr-colspan="{{productList.length + 1}}">
                                    <h3>{{category}}</h3>
                                </td>
                            </tr>
                            <tr ng-repeat="(key,value) in categoryMap[category]['attributes'] track by $index">
                                <td>{{key}}</td>
                                <td ng-repeat="product in productList track by $index" class="{{attributesValueForProduct(product.code,category,key).dataType.toLowerCase()}}" ng-class="{'no-currency-symbol': !currencyCode}">
                                    <span class="value">
                                    <span ng-if="attributesValueForProduct(product.code,category,key).dataType === 'Currency' && currencyCode" class="currency-symbol">{{currencySymbol}}</span> {{attributesValueForProduct(product.code,category,key).value }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </script> 
    <script type="text/ng-template" id="vlcProductSelect.html">
    <div class="outer-container" ng-controller="compareController">       
        <div class="container-fluid">
            <div class="row form-inline form-group">
                <div class="col-sm-12">
                    <button class="btn btn-default pull-right" ng-click="openModal(this, control)">Compare</button>
                </div>
            </div>            
        <div class="scroll-container">
            <div class="products-container" style="{{getCarouselWidth(control)}}">
                <section class="selectable-hphc" ng-repeat="p in control.vlcSI['recSet'] | orderBy : '-TotalPrice'" ng-class="{'vlc-selectableitem-selected' : p.vlcSelected, 'recommended': p.ProductRecommend}" ng-style="style">
                    <div class="top-container">
                            <h1>{{p.ProductName}}</h1>
                            <div class="subtotal">
                                <sup>{{currencySymbol}}</sup>
                                <span class="num price-format">{{formatPrice(p.TotalPrice)}}</span>
                                <span class="label-text">Monthly Premium</span>
                            </div>
                            <button class="form-control" ng-click="onSelectItem(control, p, $index, this, true)">
                                <span ng-hide="p.vlcSelected">Select Plan</span>
                                <span ng-show="p.vlcSelected" class="selected"><i class="icon icon-v-check"></i>Selected</span>
                            </button>
                            <div class="checkbox">
                                <label>
                                    <input type="checkbox" ng-model="p.vlcCompSelected" ng-change="onCompSelectItem(control)" ng-disabled="control.compDisable && !p.vlcCompSelected"> Compare
                                </label>
                            </div>
                            <a class="external-link" href="https://mp.medimpact.com/mp/secure/LaunchProductFrameset.jsp" target="_blank">Launch Product Frameset</a>
                        </div>
                        <div class="attributes-container" equal-height="true" ng-style="style">
                            <ul>
                                <li ng-repeat="attribute in p.attributes | filter: { description: 'Key' }">
                                    <strong>{{attribute.name}}</strong>
                                    <p class="{{attribute.dataType.toLowerCase()}}">
                                        <span class="currency-symbol" ng-if="attribute.dataType === 'Currency'">{{currencySymbol}}</span>
                                        <span>{{attribute.value}}</span>
                                    </p>
                                </li>
                            </ul>
                        </div>
                     </section>
                </div>
            </div>
        </div>
    </div>
    </script>  

    <script>
        var tallestAttributesContainer = 0;
        bpModule.directive('equalHeight', function($timeout) {
            function link(scope, element, attrs) {
                scope.style = {};
                scope.$watch('style', function(style){
                    $timeout(function() {
                        //console.log("offsetHeight: "+element[0].offsetHeight);
                        if(element[0].offsetHeight > tallestAttributesContainer) {
                            tallestAttributesContainer = element[0].offsetHeight;
                        }
                        //console.log("tallestAttributesContainer: "+tallestAttributesContainer)
                        scope.style = {
                            height: tallestAttributesContainer + 'px'
                        }
                    },0);
                }, true);
            }
            return {
                restrict: 'AE',
                link: link
            };
        });
    
        bpModule.controller("compareController", function($scope, $modal, $log) {
            $scope.currencyCode = $scope.bpTree.userCurrencyCode;
            $scope.currencySymbol = getCurrencySymbol($scope.currencyCode);
            
            $scope.getCarouselWidth = function(control) {
                if(control && control.vlcSI && control.itemsKey && control.vlcSI[control.itemsKey]) {
                    return "width:" + parseInt(($scope.control.vlcSI[control.itemsKey].length * 287)+20) + "px";
                }
            };
        
            $scope.getSelectValues = function(filter_type, control) {
                var selectArray = [];
                if(control && control.vlcSI && control.itemsKey && control.vlcSI[control.itemsKey]) {
                    var data = $scope.control.vlcSI[control.itemsKey],
                        products = [];
                    for(var i = 0; i < data.length; i++) {
                        var interiorData = data[i].calculationResults;
                        for(var j = 0; j < 1; j++) {
                            products.push(interiorData[j]);
                        }
                    }
                    for(var i = 0; i < products.length; i++) {
                        var inSelectArray = false;
                        for(var j = 0; j < selectArray.length; j++) {
                            if(selectArray[j] === products[i][filter_type]) {
                                inSelectArray = true;
                            }
                        }
                        if(!inSelectArray) {
                            selectArray.push(products[i][filter_type]);
                        }
                    }
                }
                return selectArray;
            };
    
            $scope.filters = {};
        
            $scope.filterChanged = function(data) {
                $scope.filteredProduct = data;
            };
        
            $scope.showProduct = function(product) {
                var filters = $scope.filters,
                    shown = true;
                for(var prop in filters) {
                    if(filters[prop] !== null && filters[prop] !== product[prop]) {
                        shown = false;
                    }
                }
                return shown;
            };
        
            $scope.formatPrice = function(price) {
                return parseFloat(price).toFixed(2);
            };    
        });
    
        // Global Currency Map and function to convert currencyCode to proper currencySymbol
        var currencyMap = [{
            "USD": "$"
        }, {
            "CAD": "$"
        }, {
            "EUR": "€"
        }, {
            "GBP": "£"
        }, {
            "JPY": "¥"
        }, {
            "KRW": "₩"
        }, {
            "CNY": "元"
        }];
    
        function getCurrencySymbol(code) {
            var currencySymbol = "";
            currencyMap.forEach(function(item) {
                if (item[code] !== undefined) {
                    currencySymbol = item[code];
                }
            });
            return currencySymbol;
        };
    
        bpModule.controller('CompareModalCtrl', function($scope, $modalInstance, content) {
            $scope.categoryList = [];
            $scope.categoryMap = {};
            $scope.productList = [];
            $scope.currencyCode = content.currencyCode;
            $scope.currencySymbol = getCurrencySymbol($scope.currencyCode);;
        
            $scope.attributesValueForProduct = function(productCode, categoryCode, attributeName) {
                return $scope.categoryMap[categoryCode]['attributes'][attributeName]['assignmentValues'][productCode];
            };
        
            $scope.transformData = function() {
                var products = content['recSet'];
                for (var i = 0; i < products.length; i++) {
                    var productAttributes = products[i];                
                    var product = {};
                    product['name'] = productAttributes['ProductName'];
                    product['code'] = productAttributes['ProductCode'];
        
                    $scope.productList.push(product);
                    var attributes = productAttributes['attributes'];
                    for (var j = 0; j < attributes.length; j++) {
                        var attributeAssignment = attributes[j];
                        var categoryName = attributeAssignment['categoryName'];
                        var attributeName = attributeAssignment['name'];
                        var attributeValue = attributeAssignment['value'];
                        var attributeDataType = attributeAssignment['dataType'];
        
                        if ($scope.categoryMap[categoryName] == null) {
                            $scope.categoryList.push(categoryName);
                            var attributeMap = {};
                            var productAssignmentMap = {};
                            productAssignmentMap[product['code']] = {
                                "value": attributeValue,
                                "dataType": attributeDataType
                            };
                            attributeMap['assignmentValues'] = productAssignmentMap;
                            attributeMap['name'] = attributeName;
                            $scope.categoryMap[categoryName] = {};
                            $scope.categoryMap[categoryName]['attributes'] = {};
                            $scope.categoryMap[categoryName]['attributes'][attributeName] = attributeMap;
                        } else {
                            var attributeMap = $scope.categoryMap[categoryName]['attributes'][attributeName];
                            if (attributeMap != null) {
                                var productAssignmentMap = attributeMap['assignmentValues'];
                                productAssignmentMap[product['code']] = {
                                    "value": attributeValue,
                                    "dataType": attributeDataType
                                };
                            } else {
                                attributeMap = {};
                                var productAssignmentMap = {};
                                productAssignmentMap[product['code']] = {
                                    "value": attributeValue,
                                    "dataType": attributeDataType
                                };
                                attributeMap['assignmentValues'] = productAssignmentMap;
                                attributeMap['name'] = attributeName;
                                $scope.categoryMap[categoryName]['attributes'][attributeName] = attributeMap;
                            }
                        }
                    }
                }
            };
        
            $scope.showCategory = function(category) {
                return ($scope.filteredCategory == null || category == $scope.filteredCategory);
            };
        
            $scope.selectedItemChanged = function(code) {
                $scope.filteredCategory = code;
            };
        
            $scope.transformData();
        
            $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
            };
        });
    </script>
    </apex:component>