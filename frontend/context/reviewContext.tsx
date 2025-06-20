import React, { createContext, useContext, useEffect, useState, ReactNode, Children } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Review = {
  product_id: string;
  uid: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
};

type ReviewContextType = {
    reviews : Review[];
    addReview : (review : Review ) => void;
    getReviewByProduct: (product_id : string) => Review[];
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const ReviewProvider = ({  children} : { children:ReactNode }) =>{
    const [ reviews , setReviews] = useState<Review[]>([]);


    useEffect(()=>{
        const loadReviews = async () => {
            const jsonValue = await AsyncStorage.getItem('reviews');
            if(jsonValue){
                setReviews(JSON.parse(jsonValue));
            }
        };
        loadReviews();
    },[]);
    useEffect(()=>{
        AsyncStorage.setItem('reviews',JSON.stringify(reviews));
    },[reviews]);

    const addReview = (review : Review) => {
        setReviews((prev) => [...prev, review]);
    };
    const getReviewByProduct = ( product_id : string) => {
        return reviews.filter((r) => r.product_id === product_id);
    };

    return (
        <ReviewContext.Provider value={{reviews , addReview , getReviewByProduct}}>
            {children}
        </ReviewContext.Provider>
    );
};
export const useReview = (): ReviewContextType =>{
    const context = useContext(ReviewContext);
    if(!context) throw new Error('useReview must be used within a ReviewProvider');
    return context;
}