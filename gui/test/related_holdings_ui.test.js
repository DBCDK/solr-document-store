import React from 'react';
import Enzyme,{ mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from "react-redux";
import configureStore from '../app/reducers/configure_store';
import RelatedHoldingsExplorer from '../app/components/related_holdings';
import { pullFailed } from '../app/actions/related_holdings';
import Loading from '../app/components/loading';
import { produceInitialState } from '../app/reducers/related_holdings';
import RelatedHoldingsItem from '../app/components/related_holdings/related_holdings_item';

Enzyme.configure({ adapter: new Adapter() });

let produceWrapper = (store) => mount((
    <Provider store={store}>
        <RelatedHoldingsExplorer/>
    </Provider>
));

describe('RelatedHoldingsExplorer properly displays based on global state',()=>{
    test('Displays error if related holdings error happened',()=>{
        let errorMessage = "HUGE ERROR!";
        let store = configureStore();
        store.dispatch(pullFailed(new Error(errorMessage)));
        const wrapper = produceWrapper(store);
        expect(wrapper.text()).toContain(errorMessage);
    });
    test('Displays loading component when selecting a bib record',()=>{
        let initialState = produceInitialState();
        initialState.loading = true;
        let store = configureStore({relatedHoldings: initialState});
        // Using mount to 'fold out' all children, which is necessary with store etc.
        const wrapper = produceWrapper(store);
        expect(wrapper.find(Loading)).toHaveProperty('length',1);
    });
    test('Display all related holdings items in global state',()=>{
        let initialState = produceInitialState();
        initialState.relatedHoldings = [{
            agencyId: '',
            trackingId: '',
            commitWithin: '',
            // missing index keys, ensures we can handle missing fields
        },{
            producerVersion: '',
            indexKeys: [],
            trackingId: '',
            commitWithin: ''
        },{
            agencyId: '',
            indexKeys: [],
            producerVersion: '',
        }];
        let store = configureStore({relatedHoldings: initialState});
        const wrapper = produceWrapper(store);
        console.log(wrapper.text());
        expect(wrapper.find(RelatedHoldingsItem)).toHaveProperty('length',initialState.relatedHoldings.length)
    });
    test('RelatedHoldingsItem component shows header fields with input',()=>{
        let initialState = produceInitialState();
        let agencyId = 'unique:agencyId';
        let trackingId = 'unique:trackingId';
        let producerVersion = 'unique:producerVersion';
        let commitWithin = 'unique:producerVersion';
        initialState.relatedHoldings = [{
            agencyId: agencyId,
            trackingId: trackingId,
            producerVersion: producerVersion,
            commitWithin: commitWithin
        }];
        let store = configureStore({relatedHoldings: initialState});
        const wrapper = produceWrapper(store);
        let text = wrapper.text();
        expect(text).toContain(agencyId);
        expect(text).toContain(trackingId);
        expect(text).toContain(producerVersion);
        expect(text).toContain(commitWithin);
    })
});