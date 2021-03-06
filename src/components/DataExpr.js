import React, {Component} from 'react';
import { ExpressionInCache, GetAndCacheExpr } from '../store.js';
import {MdCloudDownload, MdCloudDone, MdPlayArrow} from 'react-icons/md'; // possible failure in either
import styled from 'styled-components';

const FitToParent = styled.div`
    display: block;
    overflow: hidden;
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    float: right;
`;

const floatLeft = {
    float: 'left'
}
const floatRight = {
    float: 'right',
    maxWidth: '55%'
}

const floatLeftCenter = {
    position: 'absolute',
    left: '30%',
    right: '70%',
}

export default class DataExpr extends Component {
    constructor(props) {
        super(props);
        this.state = {
            executionRes : null,
            oldExpr: props.dataExpr,
        }
        this.onSelectExpr = this.onSelectExpr.bind(this);
        this.allDepsInCache = this.allDepsInCache.bind(this);
    }

    componentDidUpdate() {
        if (this.props.dataExpr != this.state.oldExpr) {
            this.setState({
                executionRes : null,
                oldExpr : this.props.dataExpr});
        }
    }

    allDepsInCache() {
        let type = Object.keys(this.props.dataExpr)[0];
        let stat = true;
        Object.keys(this.props.dataExpr[type]).forEach(
            (key, index) => {
                let obj = JSON.parse(JSON.stringify(this.props.dataExpr[type][key]));
                if (!ExpressionInCache(obj)) {
                    stat = false;
                }
            }
        )
        return stat;
    }

    async cacheExpression(expr) {
        await GetAndCacheExpr(expr);
        this.forceUpdate();
    }

    async onSelectExpr() {
        let { dataExpr, kolmo, dataobject } = this.props;
        let res = await kolmo.execWasm(dataobject.cids.SHA256, dataExpr);
        console.log("this is the response:", res);
        let response = {};
        if (res.status === "ok") {
            response['content'] = 'Successfully executed expression!'
            response['status'] = 'success';
        }
        else {
            response['status'] = "danger";
            response['content'] = res.status;
        }
        this.setState({executionRes : response});
        kolmo.forceUpdate();
    }

    async selectDep(cid) {
        let { kolmo } = this.props;
        await kolmo.setSelected(cid);
        kolmo.forceUpdate();
    }

    render() {
        let { dataExpr, onChangeCurExpr, kolmo } = this.props;
        const cacheCheck = (doi) => this.props.kolmo.cache.isCached(doi);

        let type = dataExpr["type"];
        let doKeys = Object.keys(dataExpr).filter(function(key) {
            return ((typeof(dataExpr[key]) === "object") && dataExpr[key].cid);
        });

        return (
            <div className="card mt-3">
                <div className="card-header">
                    <span style={floatLeft}>Expression Type: {JSON.stringify(type)}</span>
                    <a className="ml-2" style={floatLeft} href="#" onClick={() => this.onSelectExpr()}>
                        <MdPlayArrow/> Execute the formula
                    </a>

                </div>
                <div className="card-body">
                    <ul className="list-group list-group-flush">
                        { 
                            doKeys.map((key) => (
                                <li className="list-group-item">
                                    <div style={floatLeft}>{JSON.stringify(key)}</div>
                                    <div style={floatLeftCenter}>=</div>
                                    <a className="ml-2" style={floatRight}>
                                    {  cacheCheck(dataExpr[key].cid) ? (
                                        <span className="badge badge-success">
                                            <MdCloudDone />
                                        </span>
                                    ) : (
                                        <span className="badge badge-danger">
                                        <MdCloudDownload/>
                                        </span>
                                    )}
                                    </a>
                                    <a href="#" onClick={() => this.selectDep(dataExpr[key].cid) } style={floatRight}>
                                        <FitToParent>
                                            {dataExpr[key]['cid']}
                                        </FitToParent>
                                    </a>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                {this.state.executionRes? 
                <div className={"card-footer bg-"+this.state.executionRes.status}>
                    <div className={"card-text text-light"}>
                        {this.state.executionRes.content}
                    </div>
                </div>
                : ""}
            </div>
        );
    }
}