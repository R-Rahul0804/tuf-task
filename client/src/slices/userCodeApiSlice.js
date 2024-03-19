import {USERCODE_URL} from '../urlValue';
import { apiSlice } from './apiSlice';

export const userCodeApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) =>({
        createUserCode: builder.mutation({
            query: (newUserCode)=>({
                url: `${USERCODE_URL}/submit`,
                method: 'POST',
                body: {...newUserCode}
            }),
            invalidatesTags: ['UserCode']
        }),
        getUserCode: builder.query({
            query:()=>({
                url: `${USERCODE_URL}/code`
            }),
            keepUnusedDataFor: 5
        }),
        getSingleUserCode: builder.query({
            query:(userID)=>({
                url: `${USERCODE_URL}/code/${userID}`
            }),
            keepUnusedDataFor: 5
        }),
        runUserCode: builder.mutation({
            query:(response)=>({
                url: `${USERCODE_URL}/runcode`,
                method: 'POST',
                body:{...response}
            }),
            invalidatesTags: ['UserCode']
        })
    })
});

export const {useCreateUserCodeMutation,useGetUserCodeQuery,useRunUserCodeMutation, useGetSingleUserCodeQuery} = userCodeApiSlice;