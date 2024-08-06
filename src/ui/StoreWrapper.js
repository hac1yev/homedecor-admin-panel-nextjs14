"use client";

import { Provider } from 'react-redux'
import { store } from '../lib/store';

const StoreWrapper = ({children}) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
};

export default StoreWrapper;