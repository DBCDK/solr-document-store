import configureStore from "../app/reducers/configure_store";
import {selectBibRecord} from '../app/actions/global';

// A bit ugly, but can't make the __mocks__ thing working
jest.mock('../app/api',()=>{
    return {
        pullRelatedHoldings(bibliographicRecordId,bibliographicAgencyId){
            return new Promise((resolve,reject)=>{
                switch (bibliographicRecordId){
                    case '4321':
                        resolve({
                            result: [{
                                bibliographicRecordId: '4321'
                            }]
                        });
                    case 'handle error':
                        throw new Error('We had an error');
                    default:
                        resolve({result: []});
                }
            })
        },
    }
});
// This won't work
//jest.mock('../app/api');

describe('Search saga integration test',()=>{
    let store;
    // Set up new Redux store for each test
    beforeEach(()=>{
        store = configureStore();
    });
    test('Successful request should end up in store',async ()=>{
        store.dispatch(selectBibRecord({
            bibliographicRecordId: '4321',
            agencyId: '1234'
        }));
        // Will await all promises to complete, which includes saga, could fail if timers are involved
        await Promise.resolve();
        expect(store.getState().relatedHoldings.relatedHoldings[0]).toEqual({bibliographicRecordId: '4321'});
    });
    test('Error in API should result in error message',async ()=>{
        store.dispatch(selectBibRecord({
            bibliographicRecordId: 'handle error',
            agencyId: '1234'
        }));
        await Promise.resolve();
        expect(store.getState().relatedHoldings.errorMessage).toEqual('We had an error')
    })
});

