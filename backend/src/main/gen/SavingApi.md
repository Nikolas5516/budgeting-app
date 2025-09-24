# .SavingApi

All URIs are relative to *http://localhost:8080*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addSaving**](SavingApi.md#addSaving) | **POST** /api/v1/savings | Add a new saving
[**deleteSaving**](SavingApi.md#deleteSaving) | **DELETE** /api/v1/savings/{savingId} | Delete a saving by ID
[**getAllSavings**](SavingApi.md#getAllSavings) | **GET** /api/v1/savings | Get all savings
[**getSavingById**](SavingApi.md#getSavingById) | **GET** /api/v1/savings/{savingId} | Get saving by ID
[**updateSaving**](SavingApi.md#updateSaving) | **PUT** /api/v1/savings/{savingId} | Update an existing saving by ID


# **addSaving**
> any addSaving(savingDTO)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .SavingApi(configuration);

let body:.SavingApiAddSavingRequest = {
  // SavingDTO | Saving to add
  savingDTO: {
    id: 1,
    amount: 3.14,
    date: new Date('1970-01-01T00:00:00.00Z'),
    goal: "goal_example",
    description: "description_example",
  },
};

apiInstance.addSaving(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **savingDTO** | **SavingDTO**| Saving to add |


### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Saving added successfully |  -  |
**400** | Invalid input |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **deleteSaving**
> any deleteSaving()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .SavingApi(configuration);

let body:.SavingApiDeleteSavingRequest = {
  // number | ID of saving to delete
  savingId: 1,
};

apiInstance.deleteSaving(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **savingId** | [**number**] | ID of saving to delete | defaults to undefined


### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**204** | Saving deleted |  -  |
**404** | Saving not found |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getAllSavings**
> any getAllSavings()

Returns all available savings

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .SavingApi(configuration);

let body:any = {};

apiInstance.getAllSavings(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


### Return type

**any**

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

# **getSavingById**
> any getSavingById()

Returns a single saving

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .SavingApi(configuration);

let body:.SavingApiGetSavingByIdRequest = {
  // number | ID of saving to return
  savingId: 1,
};

apiInstance.getSavingById(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **savingId** | [**number**] | ID of saving to return | defaults to undefined


### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Saving found |  -  |
**404** | Saving not found |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **updateSaving**
> any updateSaving(savingDTO)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .SavingApi(configuration);

let body:.SavingApiUpdateSavingRequest = {
  // number | ID of saving to update
  savingId: 1,
  // SavingDTO | Updated saving
  savingDTO: {
    id: 1,
    amount: 3.14,
    date: new Date('1970-01-01T00:00:00.00Z'),
    goal: "goal_example",
    description: "description_example",
  },
};

apiInstance.updateSaving(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **savingDTO** | **SavingDTO**| Updated saving |
 **savingId** | [**number**] | ID of saving to update | defaults to undefined


### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Saving updated |  -  |
**400** | ID mismatch |  -  |
**404** | Saving not found |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


