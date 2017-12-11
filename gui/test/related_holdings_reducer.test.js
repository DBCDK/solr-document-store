import * as actions from '../app/actions/related_holdings';
import {SELECT_BIB_RECORD,selectBibRecord} from '../app/actions/global';
import relatedHoldingsReducer,{produceInitialState} from '../app/reducers/related_holdings';

describe('Related holdings action unit tests',()=>{
    test('Pull related holding successful action',()=>{
        let result = [{"id": ["4321"],"term.isbn": ["6848623"]}];
        let desiredAction = {
            type: actions.PULL_RELATED_HOLDINGS_SUCCESS,
            result
        };
        expect(actions.pullSuccess(result)).toEqual(desiredAction);
    });
    test('Pull related holding failed action',()=>{
        let exception = new Error('error message');
        let desiredAction = {
            type: actions.PULL_RELATED_HOLDINGS_FAILED,
            message: exception.message
        };
        expect(actions.pullFailed(exception)).toEqual(desiredAction);
    });
});

describe('Related holdings reducer unit tests',()=>{
    let state;
    beforeEach(()=>{
        state = produceInitialState();
    });
    test('Should return initial state',()=>{
        expect(relatedHoldingsReducer(undefined,{})).toEqual(state)
    });
    test('Should ignore undefined action',()=>{
        expect(relatedHoldingsReducer(state,undefined)).toEqual(state)
    });
    test('Reducer purity',()=>{
        let action = {
            type: actions.PULL_RELATED_HOLDINGS_FAILED,
            message: 'Soo...'
        };
        let newState = relatedHoldingsReducer(state,action);
        expect(newState).not.toBe(state);
        expect(newState).not.toEqual(state);
    });
    test('Should handle select bibliographic record id',()=>{
        let item = {
            bibliographicRecordId: '4321',
            agencyId: '1234',
            producerVersion: '1990',
            deleted: false,
            trackingId: 'ag:10'
        };
        let desiredState = produceInitialState();
        desiredState.loading = true;
        desiredState.selectedBibRecordId = item.bibliographicRecordId;
        desiredState.selectedBibAgencyId = item.agencyId;
        expect(relatedHoldingsReducer(state,selectBibRecord(item))).toEqual(desiredState)
    });
    test('Should handle pull successful',()=>{
        let result = [{
            "holdingsitem.itemId": ["4321"],
            "holdingsitem.status": ["OnShelf"],
            "rec.updatedDate": ["12/06/2016:10:14:09"]
        }];
        // Testing the reducer resets loading state
        state.loading = true;
        let desiredState = produceInitialState();
        desiredState.relatedHoldings = result;
        desiredState.loading = false;
        expect(relatedHoldingsReducer(state,actions.pullSuccess(result))).toEqual(desiredState)
    });
    test('Should handle pull failed',()=>{
        let message = 'Noooo!!!';
        // Testing the reducer resets loading state
        state.loading = true;
        let desiredState = produceInitialState();
        desiredState.errorMessage = message;
        desiredState.loading = false;
        expect(relatedHoldingsReducer(state,actions.pullFailed(new Error(message)))).toEqual(desiredState)
    });
});

// Testing when things go wrong and input sucks
describe('Reducer negative testing, ignoring invalid actions',()=>{
    let state;
    beforeEach(()=>{
        state = produceInitialState();
    });
    test('Invalid input with select bib record action',()=>{
        // Test no item in action
        let noItemAction = {
            type: SELECT_BIB_RECORD
        };
        expect(relatedHoldingsReducer(state,noItemAction)).toEqual(state);
        // Test no bibliographicRecordId in action
        let noBibIdAction = {
            type: SELECT_BIB_RECORD,
            item: {
                agencyId: '1234'
            }
        };
        expect(relatedHoldingsReducer(state,noBibIdAction)).toEqual(state);

        // Test no bibliographicAgencyId in action
        let noAgencyIdAction = {
            type: SELECT_BIB_RECORD,
            item: {
                bibliographicRecordId: '4321'
            }
        };
        expect(relatedHoldingsReducer(state,noAgencyIdAction)).toEqual(state);

        // Test item is there, but no bibliographicRecordId OR bibliographicAgencyId
        let neitherIdsAction = {
            type: SELECT_BIB_RECORD,
            item: {
                producerVersion: 'ag:19',
                deleted: true
            }
        };
        expect(relatedHoldingsReducer(state,neitherIdsAction)).toEqual(state)
    });
    test('Invalid input with pull success',()=>{
        state.loading = true;
        state.relatedHoldings = [{
            "holdingsitem.itemId": ["4321"],
            "holdingsitem.status": ["OnShelf"],
            "rec.updatedDate": ["12/06/2016:10:14:09"]
        },{
            "holdingsitem.itemId": ["4321"],
            "holdingsitem.status": ["OnShelf"],
            "rec.updatedDate": ["12/06/2016:10:14:09"]
        }];
        let noResultAction = {
            type: actions.PULL_RELATED_HOLDINGS_SUCCESS,
            unrelated: ''
        };
        let desiredState = produceInitialState();
        desiredState.relatedHoldings = [];
        desiredState.loading = false;
        // Invalid result produces no results
        expect(relatedHoldingsReducer(state,noResultAction)).toEqual(desiredState)
    });
    test('Invalid input with pull failed',()=>{
        state.errorMessage = "Lots of errors!";
        state.loading = true;
        let message = "problems";
        let invalidAction = {
            type: actions.PULL_RELATED_HOLDINGS_FAILED
        };
        let desiredState = produceInitialState();
        desiredState.loading = false;
        desiredState.errorMessage = '';
        expect(relatedHoldingsReducer(state,invalidAction)).toEqual(desiredState);
        let invalidAction2 = {
            type: actions.PULL_RELATED_HOLDINGS_FAILED,
            message: new Error(message)
        };
        let desiredState2 = produceInitialState();
        desiredState2.loading = false;
        desiredState2.errorMessage = '';
        expect(relatedHoldingsReducer(state,invalidAction2)).toEqual(desiredState2)
    });
    test('Invalid action type will be ignored',()=>{
        let invalidAction = {
            noGoodField: ['no','good']
        };
        expect(relatedHoldingsReducer(state,invalidAction)).toBe(state)
    })
});
