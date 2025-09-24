# .ExpenseControllerApi

All URIs are relative to *http://localhost:8080*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addExpense**](ExpenseControllerApi.md#addExpense) | **POST** /api/v1/expenses | 
[**deleteExpense**](ExpenseControllerApi.md#deleteExpense) | **DELETE** /api/v1/expenses/{id} | 
[**getAllExpenses**](ExpenseControllerApi.md#getAllExpenses) | **GET** /api/v1/expenses | 
[**getExpenseById**](ExpenseControllerApi.md#getExpenseById) | **GET** /api/v1/expenses/{id} | 
[**updateExpense**](ExpenseControllerApi.md#updateExpense) | **PUT** /api/v1/expenses/{id} | 


# **addExpense**
> ExpenseDTO addExpense(expenseDTO)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ExpenseControllerApi(configuration);

let body:.ExpenseControllerApiAddExpenseRequest = {
  // ExpenseDTO
  expenseDTO: {
    id: 1,
    userId: 1,
    amount: 3.14,
    category: "category_example",
    date: new Date('1970-01-01').toISOString().split('T')[0];,
    description: "description_example",
  },
};

apiInstance.addExpense(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **expenseDTO** | **ExpenseDTO**|  |


### Return type

**ExpenseDTO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **deleteExpense**
> void deleteExpense()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ExpenseControllerApi(configuration);

let body:.ExpenseControllerApiDeleteExpenseRequest = {
  // number
  id: 1,
};

apiInstance.deleteExpense(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**number**] |  | defaults to undefined


### Return type

**void**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getAllExpenses**
> Array<ExpenseDTO> getAllExpenses()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ExpenseControllerApi(configuration);

let body:.ExpenseControllerApiGetAllExpensesRequest = {
  // number
  userId: 1,
};

apiInstance.getAllExpenses(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | [**number**] |  | defaults to undefined


### Return type

**Array<ExpenseDTO>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getExpenseById**
> ExpenseDTO getExpenseById()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ExpenseControllerApi(configuration);

let body:.ExpenseControllerApiGetExpenseByIdRequest = {
  // number
  id: 1,
};

apiInstance.getExpenseById(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**number**] |  | defaults to undefined


### Return type

**ExpenseDTO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **updateExpense**
> ExpenseDTO updateExpense(expenseDTO)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ExpenseControllerApi(configuration);

let body:.ExpenseControllerApiUpdateExpenseRequest = {
  // number
  id: 1,
  // ExpenseDTO
  expenseDTO: {
    id: 1,
    userId: 1,
    amount: 3.14,
    category: "category_example",
    date: new Date('1970-01-01').toISOString().split('T')[0];,
    description: "description_example",
  },
};

apiInstance.updateExpense(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **expenseDTO** | **ExpenseDTO**|  |
 **id** | [**number**] |  | defaults to undefined


### Return type

**ExpenseDTO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


