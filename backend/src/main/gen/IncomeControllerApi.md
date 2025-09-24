# .IncomeControllerApi

All URIs are relative to *http://localhost:8080*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createIncome**](IncomeControllerApi.md#createIncome) | **POST** /api/v1/incomes | 
[**deleteIncome**](IncomeControllerApi.md#deleteIncome) | **DELETE** /api/v1/incomes/{id} | 
[**getAllIncomes**](IncomeControllerApi.md#getAllIncomes) | **GET** /api/v1/incomes | 
[**getIncomeById**](IncomeControllerApi.md#getIncomeById) | **GET** /api/v1/incomes/{id} | 
[**updateIncome**](IncomeControllerApi.md#updateIncome) | **PUT** /api/v1/incomes/{id} | 


# **createIncome**
> IncomeDTO createIncome(incomeDTO)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .IncomeControllerApi(configuration);

let body:.IncomeControllerApiCreateIncomeRequest = {
  // IncomeDTO
  incomeDTO: {
    id: 1,
    amount: 3.14,
    source: "source_example",
    date: new Date('1970-01-01T00:00:00.00Z'),
    description: "description_example",
  },
};

apiInstance.createIncome(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **incomeDTO** | **IncomeDTO**|  |


### Return type

**IncomeDTO**

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

# **deleteIncome**
> void deleteIncome()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .IncomeControllerApi(configuration);

let body:.IncomeControllerApiDeleteIncomeRequest = {
  // number
  id: 1,
};

apiInstance.deleteIncome(body).then((data:any) => {
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

# **getAllIncomes**
> Array<IncomeDTO> getAllIncomes()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .IncomeControllerApi(configuration);

let body:any = {};

apiInstance.getAllIncomes(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


### Return type

**Array<IncomeDTO>**

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

# **getIncomeById**
> IncomeDTO getIncomeById()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .IncomeControllerApi(configuration);

let body:.IncomeControllerApiGetIncomeByIdRequest = {
  // number
  id: 1,
};

apiInstance.getIncomeById(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**number**] |  | defaults to undefined


### Return type

**IncomeDTO**

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

# **updateIncome**
> IncomeDTO updateIncome(incomeDTO)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .IncomeControllerApi(configuration);

let body:.IncomeControllerApiUpdateIncomeRequest = {
  // number
  id: 1,
  // IncomeDTO
  incomeDTO: {
    id: 1,
    amount: 3.14,
    source: "source_example",
    date: new Date('1970-01-01T00:00:00.00Z'),
    description: "description_example",
  },
};

apiInstance.updateIncome(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **incomeDTO** | **IncomeDTO**|  |
 **id** | [**number**] |  | defaults to undefined


### Return type

**IncomeDTO**

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


