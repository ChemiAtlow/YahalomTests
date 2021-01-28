import React from 'react';
import "./Loader.scoped.scss";

const Loader = React.memo(() =>
    <div className="loader">
        <span className="loader__ball loader__ball--1" />
        <span className="loader__ball loader__ball--2" />
        <span className="loader__ball loader__ball--3" />
    </div>
);

export default Loader;
