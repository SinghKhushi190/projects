// Buy ans sell stocks -II(Tabulation mode)
#include <iostream>
#include <vector>
using namespace std;

long f(int ind, int buy, long *values, int n, vector<vector<long>> &dp)
{
    if (ind == n)
        return 0;
    if (dp[ind][buy] != -1)
        return dp[ind][buy];
    long profit = 0;
    if (buy)
    {
        profit = max(-values[ind] + f(ind + 1, 0, values, n, dp),
                     0 + f(ind + 1, 1, values, n, dp));
    }
    else
    {
        profit = max(values[ind] + f(ind + 1, 1, values, n, dp),
                     0 + f(ind + 1, 0, values, n, dp));
    }
    return dp[ind][buy] = profit;
}
long getMaximumProfit(long *values, int n)
{
    vector<long> ahead(2, 0), curr(2, 0);
    ahead[0] = ahead[1] = 0;
    for (int ind = n - 1; ind >= 0; ind--)
    {
        for (int buy = 0; buy <= 1; buy++)
        {
            long profit = 0;
            if (buy)
            {
                profit = max(-values[ind] + ahead[0],
                             0 + ahead[1]);
            }
            else
            {
                profit = max(values[ind] + ahead[1],
                             0 + ahead[0]);
            }
            curr[buy] = profit;
        }
        ahead = curr;
    }

    return ahead[1];
}