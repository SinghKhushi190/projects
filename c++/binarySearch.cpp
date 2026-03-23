// Binary Search
#include <iostream>
#include <vector>
#include<bits/stdc++.h>
using namespace std;

int search(vector<int> &nums, int target)
{
    int n = nums.size();
    int low = 0, high = n - 1;
    while (low <= high)
    {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target)
            return mid;
        else if (target > nums[mid])
            low = mid + 1;
        else
            high = mid - 1;
    }
    return -1;
}
// Using Recursion in binary search
int bs(vector<int> &nums, int low, int high, int target)
{
    if(low > high) return -1;
    int mid = (low + high) / 2;
    if (nums[mid] == target)
        return mid;
    else if(target > nums[mid]) return bs(nums , mid+1, high , target);
    return bs(nums, low , high -1, target);
}
int search(vector<int> &nums, int target){
    return bs(nums , 0 , nums.size() -1 , target);
}

//Implementation of lower bound using binary search
int lowerBound(vector<int>arr, int n , int x){
    int low = 0, high = n - 1;
    int ans = n;
    while(low <= high){
        int mid = (low + high)/2;
        // maybe an answer
        if(arr[mid] >= x){
            ans = mid;
            // look for more small index on left;
            high = mid  - 1;
        }
        else{
            low = mid + 1; // look on right side
        }
    }
    return ans;
}

// Implementation of upper bound using binary search
int upperBound(vector<int>arr, int n , int x){
    int low = 0, high = n - 1;
    int ans = n;
    while(low <= high){
        int mid = (low + high)/2;
        // maybe an answer
        if(arr[mid] > x){
            ans = mid;
            // look for more small index on left;
            high = mid  - 1;
        }
        else{
            low = mid + 1; // look on right side
        }
    }
    return ans;
}

// First and last occurrence of an element in a sorted array
// time complexity :2* O(log n)
// Space complexity : O(1)
int lowerBound(vector<int>arr, int n , int x){
    int low = 0, high = n - 1;
    int ans = n;
    while(low <= high){
        int mid = (low + high)/2;
        // maybe an answer
        if(arr[mid] >= x){
            ans = mid;
            // look for more small index on left;
            high = mid  - 1;
        }
        else{
            low = mid + 1; // look on right side
        }
    }
    return ans;
}
int upperBound(vector<int>arr, int n , int x){
    int low = 0, high = n - 1;
    int ans = n;
    while(low <= high){
        int mid = (low + high)/2;
        // maybe an answer
        if(arr[mid] > x){
            ans = mid;
            // look for more small index on left;
            high = mid  - 1;
        }
        else{
            low = mid + 1; // look on right side
        }
    }
    return ans;
}
pair<int , int> firstAndLastPosition(vector<int>&arr, int n , int k){
    int lb = lowerBound(arr , n , k);
    if(lb == n || arr[lb] != k) return{-1 , -1};
    return{lb , upperBound(arr, n ,k)  -1};
}

// Find out how many times a sorted array is rotated
int findKRotation(vector<int> &arr ){
    int low = 0, high = arr.size() -1;
    int ans = INT_MAX;
    int index = -1;
    while(low <= high){
        int mid = (low + high)/2;
        if(arr[low] <= arr[high]){
            if(arr[low] < ans){
                ans = arr[low];
                index = low;
            }
            break;
        }
        if(arr[low] <= arr[mid]){
            if(arr[low] < ans){
                ans = arr[low];
                index = low;
            }
            low= mid + 1;
        }
        else{
            high = mid -1;
            if(arr[mid] < ans){
                ans = arr[mid];
                index = mid;
            }

        }
    }
    return index;
}

// Agressive cows problem(optimal solution using binary search)
bool canWePlace(vector<int> &stalls , int dist ,  int cows){
    int cntCows = 1 , last = stalls[0];
    for(int i = 1; i < stalls.size(); i++){
        if(stalls[i] - last >= dist){
            cntCows++;
            last = stalls[i];
        }
        if(cntCows >= cows) return true;
    }
    return false;
}
int aggressiveCows(vector<int> &stalls , int k){
    sort(stalls.begin() , stalls.end());
    int n = stalls.size();
    int low = 1, high = stalls[n-1] - stalls[0];
    while(low <= high){
        int mid = (low + high)/2;
        if(canWePlace(stalls , mid , k) == true){
            low = mid + 1;
        }
        else{
            high = mid - 1;
        }
    }
    return high;
}