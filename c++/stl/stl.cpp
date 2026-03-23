//COMPLETE STL

// Pairs
#include<bits/stdc++.h>
using namespace std;
void explainPair(){
    pair<int , int> p = {1,3};
    cout<<p.first<<" "<<p.second;
    pair<int , pair<int,int>> p2 = {1,{3,4}};
    cout << p2.first <<" "<< p2.second.second<<" "<< p2.second.first;
    pair<int , int> arr[] = {{1,2},{3,4},{5,6}};
    cout << arr[1].second;
}

//Vectors
void explainVector(){
    vector<int> v;

    v.push_back(1);
    v.emplace_back(2);

    vector<pair<int , int >> vec;

    vec.push_back({1 , 2});
    v.emplace_back(1, 2);

    vector<int> v(5);

    vector<int> v(5, 20);  // here 5times 20 write
    vector<int> v2(v);


    vector <int> :: iterator it = v.begin();

    it++;
    cout<< *(it) << " ";   // here (*) star are using for addressing the element
     
    it =  it + 2 ; // here increment with two element
    cout<< *(it) << " ";

    vector<int>::iterator it = v.end(); // here we are using v.end() for enter element in last position
    vector<int>::reverse_iterator it = v.rend();
    vector<int>::reverse_iterator it = v.rbegin();


     cout << v[0] <<" " << v[0];
     cout << v.back() << " ";



     for(vector<int>:: iterator it = v.begin(); it != v.end(); it++){
        cout<< *(it) << " ";
     }
    
     for(auto it = v.begin(); it != v.end(); it++){ // here auto are using for automatically aasign vector element , don't need write iteration
                cout<< *(it) << " ";
     }

     
    for(auto it : v){
        cout << it <<  " ";
    }


    // {10, 20, 12, 23}
    v.erase(v.begin() + 1);

    // {10 , 20, 12, 23, 35}
    v.erase(v.begin() + 2, v.begin() + 4);  // { 10, 20 ,35} [ start , end)


    // Insert function
    vector<int> v(2, 100); // {100, 100}
    v.insert(v.begin() , 300); // {300, 100 , 100}
    v.insert(v.begin() + 1, 2, 10); // { 300 , 10 ,10, 100 , 100}

    vector<int> copy(2, 50); // { 50, 50}
    v.insert(v.begin(), copy.begin(), copy.end()); // {50, 50, 300, 10, 10, 100, 100}


    // {10, 20}
    cout << v. size();  // 2

    // {10 ,20}
    v.pop_back(); // {10}

    // v1 -> {10, 20}
    // v2 -> {30, 40}
    vector<int> v1 = {10, 20};
    vector<int> v2 = {30, 40};
    v1.swap(v2); // v1 -> {30, 40} , v2 -> {10 , 20}

    v.clear(); // erase the entire vector

    cout << v.empty();

}





// LIST
void explainList(){
    list<int> ls;

    ls.push_back(2); // {2}
    ls.emplace_back(4); // {2 ,4}

    ls.push_front(5); // {5, 2 ,4}

    ls.emplace_front(); // {2 ,4}

}



// Deque

void explainDeque(){
    deque<int> dq;
    dq.push_back(1);
    dq.emplace_back(2);
    dq.push_front(4);
    dq.emplace_front(3);

    dq.pop_back();
    dq.pop_front();

    dq.back();
    dq.front();
// rest functions same as vector and list
}



// Stack
void explainStack(){
    stack <int> st;
    st.push(1); // {1}
    st.push(2); // {2, 1}
    st.push(3); // {3, 2 ,1}
    st.emplace(5); // {5, 3, 2, 1}

    cout<< st.top(); // print 5 "** st[2] is invalid **"

    st.pop();   // st look like {3, 2, 1}

    cout << st.top(); // 2

    cout << st.size();  // stack of size is 3

    cout << st.empty();

    stack<int>st1,st2;
    st1.swap(st2);


}



// Queue
void explianQueuse(){
    queue<int> q;
    q.push(1);
    q.push(2);
    q.emplace(5);

    q.back() += 5;

    // Q is{1, 2, 3}
    cout<< q.front ();  // print 1

    q.pop();  // {2, 9}

    cout<< q.front(); // print 2

    // Size swap empty same as stack

}


// priority Queue
void explainPQ(){
    priority_queue<int>pq;

    pq.push(5);
    pq.push(2);
    pq.emplace(10);

    cout << pq.top();

    pq.pop();

    cout<< pq.top();

    // Size swap empty function same as empty

    //minimum Heap
    priority_queue<int, vector<int> , greater<int>> pq;  // Syntax
    pq.push(5); // {5}
    pq.push(2);  //{ 2, 5}
    pq.push(8);  // {2, 5, 8}
    pq.emplace(10); // {2, 5, 8, 10}

    cout<< pq.top();  // print 2

}





// 








