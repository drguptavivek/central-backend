ContentsMenuExpandLight modeDark modeAuto light/dark, in light modeAuto light/dark, in dark mode[Skip to content](https://docs.getodk.org/central-api-accounts-and-users/#furo-main-content)

[Back to top](https://docs.getodk.org/central-api-accounts-and-users/#)

# Accounts and Users [¶](https://docs.getodk.org/central-api-accounts-and-users/\#accounts-and-users "Link to this heading")

Today, there are two types of accounts: `Users`, which are the administrative accounts held by staff members managing the data collection process, and `App Users`, which are restricted access keys granted per Form within a Project to data collection clients in the field. Although both of these entities are backed by `Actor`s as we explain in the [Authentication section](https://docs.getodk.org/central-api-authentication) above, there is not yet any way to directly create or manipulate an Actor. Today, you can only create, manage, and delete Users and App Users.

Actors (and thus Users) may be granted rights via Roles. The `/roles` Roles API is open for all to access, which describes all defined roles on the server. Getting information for an individual role from that same API will reveal which verbs are associated with each role: some role might allow only `submission.create` and `submission.update`, for example.

Right now, there are four predefined system roles: Administrator (`admin`), Project Manager (`manager`), Data Collector (`formfill`), and App User (`app-user`). Administrators are allowed to perform any action upon the server, while Project Managers are allowed to perform any action upon the projects they are assigned to manage.

Data Collectors can see all Forms in a Project and submit to them, but cannot see Submissions and cannot edit Form settings. Similarly, App Users are granted minimal rights: they can read Form data and create new Submissions on those Forms. While Data Collectors can perform these actions directly on the Central administration website by logging in, App Users can only do these things through Collect or a similar data collection client device.

The Roles API alone does not, however, tell you which Actors have been assigned with Roles upon which system objects. For that, you will need to consult the various Assignments resources. There are two, one under the API root (`/v1/assignments`), which manages assignments to the entire system, and another nested under each Project (`/v1/projects/…/assignments`) which manage assignments to that Project.

## Users [¶](https://docs.getodk.org/central-api-accounts-and-users/\#users "Link to this heading")

Presently, it is possible to create and list `User`s in the system, as well as to perform password reset operations. In future versions of this API it will be possible to manage existing user information and delete accounts as well.

### Listing all Users [¶](https://docs.getodk.org/central-api-accounts-and-users/\#listing-all-users "Link to this heading")

**GET /v1/users**

Currently, there are no paging or filtering options, so listing `User`s will get you every User in the system, every time.

Optionally, a `q` querystring parameter may be provided to filter the returned users by any given string. The search is performed via a [trigram similarity index](https://www.postgresql.org/docs/14/pgtrgm.html) over both the Email and Display Name fields, and results are ordered by match score, best matches first. Note that short search terms (less than 4 or 5 characters) may not return any results. Try a longer search if nothing is appearing.

If a `q` parameter is given, and it exactly matches an email address that exists in the system, that user's details will always be returned, even for actors who cannot `user.list`. The request must still authenticate as a valid Actor. This allows non-Administrators to choose a user for an action (eg grant rights) without allowing full search.

Actors who cannot `user.list` will always receive `[]` with a `200 OK` response.

Request

**Parameters**

|     |     |
| --- | --- |
| `q`<br>_(query)_ | `string`<br>An optional search parameter.<br>Example: `alice` |

Response

**HTTP Status: 200**

Content Type: application/json

Example

```
[$
  {$
    "createdAt": "2018-04-18T23:19:14.802Z",$
    "displayName": "My Display Name",$
    "id": 115,$
    "type": "user",$
    "updatedAt": "2018-04-18T23:42:11.406Z",$
    "deletedAt": "2018-04-18T23:42:11.406Z",$
    "email": "my.email.address@getodk.org"$
  }$
]
```

Copy to clipboard

Schema

|     |     |
| --- | --- |
| array

|     |     |
| --- | --- |
| `createdAt` | `string`<br>ISO date format<br>Example: `2018-04-18 23:19:14.802000+00:00` |
| `displayName` | `string`<br>All `Actor`s, regardless of type, have a display name<br>Example: `My Display Name` |
| `id` | `number`<br>Example: `115.0` |
| `type` | `enum`

The type of actor

expand

|     |     |
| --- | --- |
| `user` | `string` |
| `field_key` | `string` |
| `public_link` | `string` |
| `singleUse` | `string` | |
| `updatedAt` | `string`<br>ISO date format<br>Example: `2018-04-18 23:42:11.406000+00:00` |
| `deletedAt` | `string`<br>ISO date format<br>Example: `2018-04-18 23:42:11.406000+00:00` |
| `email` | `string`<br>The email address of the user |
| `lastLoginAt` | `string`<br>The timestamp of when the user last logged in. Will be null if the user has never logged in.<br>Example: `2025-01-15T10:30:00.000Z` | |

### Creating a new User [¶](https://docs.getodk.org/central-api-accounts-and-users/\#creating-a-new-user "Link to this heading")

**POST /v1/users**

All that is required to create a new user is an email address. That email address will receive a message instructing the new user on how to claim their new account and set a password.

Optionally, a password may also be supplied as a part of this request. If it is, the account is immediately usable with the given credentials. However, an email will still be dispatched with claim instructions as above.

Users are not able to do anything upon creation besides log in and change their own profile information. To allow Users to perform useful actions, you will need to [assign them one or more Roles](https://docs.getodk.org/central-api-accounts-and-users/#assignments).

Request

**Request body**

Example

```
{
  "email": "my.email.address@getodk.org"
}
```

Copy to clipboard

Schema

|     |     |
| --- | --- |
| object

|     |     |
| --- | --- |
| `email` | `string`<br>The email address of the User account to be created. |
| `password` | `string`<br>If provided, the User account will be created with this password. Otherwise, the user will still be able set their own password later. | |

Response

**HTTP Status: 200**

Content Type: application/json

Example

```
{
  "createdAt": "2018-04-18T23:19:14.802Z",
  "displayName": "My Display Name",
  "id": 115,
  "type": "user",
  "updatedAt": "2018-04-18T23:42:11.406Z",
  "deletedAt": "2018-04-18T23:42:11.406Z",
  "email": "my.email.address@getodk.org"
}
```

Copy to clipboard

Schema

|     |     |
| --- | --- |
| object

|     |     |
| --- | --- |
| `createdAt` | `string`<br>ISO date format |
| `displayName` | `string`<br>All `Actor`s, regardless of type, have a display name |
| `id` | `number` |
| `type` | `enum`

the Type of this Actor; typically this will be `user`.

expand

|     |     |
| --- | --- |
| `user` | `string` |
| `field_key` | `string` |
| `public_link` | `string` |
| `singleUse` | `string` | |
| `updatedAt` | `string`<br>ISO date format |
| `deletedAt` | `string`<br>ISO date format |
| `email` | `string`<br>Only `User`s have email addresses associated with them | |

**HTTP Status: 400**

Content Type: application/json

Example

```
{
  "code": "400",
  "message": "Could not parse the given data (2 chars) as json."
}
```

Copy to clipboard

Schema

|     |     |
| --- | --- |
| object

|     |     |
| --- | --- |
| `code` | `string` |
| `details` | `object`<br>a subobject that contains programmatically readable details about this error |
| `message` | `string` | |

### Getting User details [¶](https://docs.getodk.org/central-api-accounts-and-users/\#getting-user-details "Link to this heading")

**GET /v1/users/{actorId}**

Typically, you supply the integer ID to get information about the user associated with that id.

It is also possible to supply the text `current` instead of an integer ID; please see the following endpoint for documentation about this.

Request

**Parameters**

|     |     |
| --- | --- |
| `actorId` | `string`<br>Typically the integer ID of the `User`. For getting user details, you can also supply the text `current`, which will tell you about the currently authenticated user.<br>Example: `42` |

Response

**HTTP Status: 200**

Content Type: application/json

Example

```
{
  "createdAt": "2018-04-18T23:19:14.802Z",
  "displayName": "My Display Name",
  "id": 115,
  "type": "user",
  "updatedAt": "2018-04-18T23:42:11.406Z",
  "deletedAt": "2018-04-18T23:42:11.406Z",
  "email": "my.email.address@getodk.org"
}
```

Copy to clipboard

Schema

|     |     |
| --- | --- |
| object

|     |     |
| --- | --- |
| `createdAt` | `string`<br>ISO date format |
| `displayName` | `string`<br>All `Actor`s, regardless of type, have a display name |
| `id` | `number` |
| `type` | `enum`

the Type of this Actor; typically this will be `user`.

expand

|     |     |
| --- | --- |
| `user` | `string` |
| `field_key` | `string` |
| `public_link` | `string` |
| `singleUse` | `string` | |
| `updatedAt` | `string`<br>ISO date format |
| `deletedAt` | `string`<br>ISO date format |
| `email` | `string`<br>Only `User`s have email addresses associated with them | |

### Deleting a User [¶](https://docs.getodk.org/central-api-accounts-and-users/\#deleting-a-user "Link to this heading")

**DELETE /v1/users/{actorId}**

Upon User deletion:

- The account will be removed,

- the user will be logged out of all existing sessions,

- and should the user attempt to reset their password, they will receive an email informing them that their account has been removed.


The User record will remain on file within the database, so that when for example information about the creator of a Form or Submission is requested, basic details are still available on file. A new User account may be created with the same email address as any deleted accounts.

Request

**Parameters**

|     |     |
| --- | --- |
| `actorId` | `string`<br>Typically the integer ID of the `User`. For getting user details, you can also supply the text `current`, which will tell you about the currently authenticated user.<br>Example: `42` |

Response

**HTTP Status: 200**

Content Type: application/json

Example

```
{
  "success": true
}
```

Copy to clipboard

Schema

|     |     |
| --- | --- |
| object

|     |     |
| --- | --- |
| `success` | `boolean` | |

### Modifying a User [¶](https://docs.getodk.org/central-api-accounts-and-users/\#modifying-a-user "Link to this heading")

**PATCH /v1/users/{actorId}**

You can `PATCH` JSON data to update User details. Not all user information is modifiable; right now, the following fields may be updated:

- `displayName` sets the friendly display name the web interface uses to refer to the user.

- `email` sets the email address associated with the account.


When user details are updated, the `updatedAt` field will be automatically updated.

Request

**Parameters**

|     |     |
| --- | --- |
| `actorId` | `string`<br>The integer ID of the `User`.<br>Example: `42` |

**Request body**

Example

```
{
  "displayName": "New Name",
  "email": "new.email.address@getodk.org"
}
```

Copy to clipboard

Schema

|     |     |
| --- | --- |
| object

|     |     |
| --- | --- |
| `displayName` | `string`<br>The friendly display name that should be associated with this User. |
| `email` | `string`<br>The email address that should be associated with this User. | |

Response

**HTTP Status: 200**

Content Type: application/json

Example

```
{
  "createdAt": "2018-04-18T23:19:14.802Z",
  "displayName": "My Display Name",
  "id": 115,
  "type": "user",
  "updatedAt": "2018-04-18T23:42:11.406Z",
  "deletedAt": "2018-04-18T23:42:11.406Z",
  "email": "my.email.address@getodk.org"
}
```

Copy to clipboard

Schema

|     |     |
| --- | --- |
| object

|     |     |
| --- | --- |
| `createdAt` | `string`<br>ISO date format |
| `displayName` | `string`<br>All `Actor`s, regardless of type, have a display name |
| `id` | `number` |
| `type` | `enum`

the Type of this Actor; typically this will be `user`.

expand

|     |     |
| --- | --- |
| `user` | `string` |
| `field_key` | `string` |
| `public_link` | `string` |
| `singleUse` | `string` | |
| `updatedAt` | `string`<br>ISO date format |
| `deletedAt` | `string`<br>ISO date format |
| `email` | `string`<br>Only `User`s have email addresses associated with them | |

**HTTP Status: 400**

Content Type: application/json

Example

```
{
  "code": "400",
  "message": "Could not parse the given data (2 chars) as json."
}
```

Copy to clipboard

Schema

|     |     |
| --- | --- |
| object

|     |     |
| --- | --- |
| `code` | `string` |
| `details` | `object`<br>a subobject that contains programmatically readable details about this error |
| `message` | `string` | |

### Getting authenticated User details [¶](https://docs.getodk.org/central-api-accounts-and-users/\#getting-authenticated-user-details "Link to this heading")

**GET /v1/users/current**

Typically, you would get User details by the User's numeric Actor ID.

However, if you only have a Bearer token, for example, you don't have any information about the user attached to that session, including even the ID with which to get more information. So you can instead supply the text `current` to get the user information associated with the authenticated session.

If you _do_ use `current`, you may request extended metadata. Supply an `X-Extended-Metadata` header value of `true` to additionally receive:

- an array of strings of the `verbs` the authenticated User/Actor is allowed to perform server-wide
- an object containing the preferences of the authenticated User/Actor

Request

This endpoint doesn't take any request parameter or data

Response

**HTTP Status: 200**

Content Type: application/json

Example

```
{
  "createdAt": "2018-04-18T23:19:14.802Z",
  "displayName": "My Display Name",
  "id": 115,
  "type": "user",
  "updatedAt": "2018-04-18T23:42:11.406Z",
  "deletedAt": "2018-04-18T23:42:11.406Z",
  "email": "my.email.address@getodk.org"
}
```

Copy to clipboard

Schema

|     |     |
| --- | --- |
| object

|     |     |
| --- | --- |
| `createdAt` | `string`<br>ISO date format |
| `displayName` | `string`<br>All `Actor`s, regardless of type, have a display name |
| `id` | `number` |
| `type` | `enum`

the Type of this Actor; typically this will be `user`.

expand

|     |     |
| --- | --- |
| `user` | `string` |
| `field_key` | `string` |
| `public_link` | `string` |
| `singleUse` | `string` | |
| `updatedAt` | `string`<br>ISO date format |
| `deletedAt` | `string`<br>ISO date format |
| `email` | `string`<br>Only `User`s have email addresses associated with them | |

**HTTP Status: 200**

Content Type: application/json; extended

Example

```
{
  "createdAt": "2018-04-18T23:19:14.802Z",
  "displayName": "My Display Name",
  "id": 115,
  "type": "user",
  "updatedAt": "2018-04-18T23:42:11.406Z",
  "deletedAt": "2018-04-18T23:42:11.406Z",
  "email": "my.email.address@getodk.org",
  "verbs": [$
    "project.create",$
    "project.update"$
  ],
  "preferences": {
    "site": {
      "projectSortMode": "latest"
    },
    "projects": {
      "1": {
        "formTrashCollapsed": false
      }
    }
  }
}
```

Copy to clipboard

Schema

|     |     |
| --- | --- |
| object

|     |     |
| --- | --- |
| `createdAt` | `string`<br>ISO date format |
| `displayName` | `string`<br>All `Actor`s, regardless of type, have a display name |
| `id` | `number` |
| `type` | `enum`

the Type of this Actor; typically this will be `user`.

expand

|     |     |
| --- | --- |
| `user` | `string` |
| `field_key` | `string` |
| `public_link` | `string` |
| `singleUse` | `string` | |
| `updatedAt` | `string`<br>ISO date format |
| `deletedAt` | `string`<br>ISO date format |
| `email` | `string`<br>Only `User`s have email addresses associated with them |
| `verbs` | `array`<br>The verbs the authenticated Actor is allowed to perform server-wide. |
| `preferences` | `object`

The preferences of this user

expand

|     |     |
| --- | --- |
| `site` | `object` |
| `projects` | `object` | | |

### Directly updating a user password [¶](https://docs.getodk.org/central-api-accounts-and-users/\#directly-updating-a-user-password "Link to this heading")

**PUT /v1/users/{actorId}/password**

To directly update a user password, you will need to reprove the user's intention by supplying the `old` password alongside the `new`. If you simply want to initiate an email-based password reset process, see the following endpoint.

Request

**Parameters**

|     |     |
| --- | --- |
| `actorId` | `string`<br>The integer ID of the `User`.<br>Example: `42` |

**Request body**

Example

```
{
  "old": "old.password",
  "new": "new.password"
}
```

Copy to clipboard

Schema

|     |     |
| --- | --- |
| object

|     |     |
| --- | --- |
| `old` | `string`<br>The user's current password. |
| `new` | `string`<br>The new password that the user wishes to set. | |

Response

**HTTP Status: 200**

Content Type: application/json

Example

```
{
  "success": true
}
```

Copy to clipboard

Schema

|     |     |
| --- | --- |
| object

|     |     |
| --- | --- |
| `success` | `boolean` | |

### Initating a password reset [¶](https://docs.getodk.org/central-api-accounts-and-users/\#initating-a-password-reset "Link to this heading")

**POST /v1/users/reset/initiate**

Anybody can initate a reset of any user's password. An email will be sent with instructions on how to complete the password reset; it contains a token that is required to complete the process.

The optional query parameter `invalidate` may be set to `true` to immediately invalidate the user's current password, regardless of whether they complete the reset process. This can be done if, for example, their password has been compromised. In order to do this, though, the request must be performed as an authenticated user with permission to do this. If invalidation is attempted without the proper permissions, the entire request will fail.

If the email address provided does not match any user in the system, that address will still be sent an email informing them of the attempt and that no account was found.

Request

**Parameters**

|     |     |
| --- | --- |
| `invalidate`<br>_(query)_ | `boolean`<br>Specify `true` in order to immediately invalidate the user's present password.<br>Example: `true` |

**Request body**

Example

```
{
  "email": "my.email.address@getodk.org"
}
```

Copy to clipboard

Schema

|     |     |
| --- | --- |
| object

|     |     |
| --- | --- |
| `email` | `string`<br>The email address of the User account whose password is to be reset. | |

Response

**HTTP Status: 200**

Content Type: application/json

Example

```
{
  "success": true
}
```

Copy to clipboard

Schema

|     |     |
| --- | --- |
| object

|     |     |
| --- | --- |
| `success` | `boolean` | |

## User Preferences [¶](https://docs.getodk.org/central-api-accounts-and-users/\#user-preferences "Link to this heading")

The Central frontend uses this API to save various user preferences, such as the sorting order of certain listings. When a user starts a new session, these preferences are loaded in as part of the [User object](https://docs.getodk.org/central-api-accounts-and-users/#getting-authenticated-user-details).

Preferences can be set site-wide or per-project.

### Setting a project preference [¶](https://docs.getodk.org/central-api-accounts-and-users/\#setting-a-project-preference "Link to this heading")

**PUT /v1/user-preferences/project/{projectId}/{propertyName}**

Request

**Parameters**

|     |     |
| --- | --- |
| `projectId` | `integer`<br>The integer ID of the `Project`.<br>Example: `42` |
| `propertyName` | `string`<br>The name of the preference.<br>Example: `frobwazzleEnabled` |

**Request body**

Example

```
{
  "propertyValue": true
}
```

Copy to clipboard

Schema

|     |     |
| --- | --- |
| None

|     |     |
| --- | --- |
| `propertyValue` | `None`<br>The preference to be stored. It may be of any json-serializable type. | |

Response

**HTTP Status: 200**

Content Type: application/json

Example

```
{
  "success": true
}
```

Copy to clipboard

Schema

|     |     |
| --- | --- |
| object

|     |     |
| --- | --- |
| `success` | `boolean` | |

**HTTP Status: 404**

Content Type: application/json

Example

```
{
  "code": 404.1,
  "message": "Could not find the resource you were looking for."
}
```

Copy to clipboard

Schema

|     |     |
| --- | --- |
| object

|     |     |
| --- | --- |
| `code` | `number`<br>Example: `404.1` |
| `message` | `string`<br>Example: `Could not find the resource you were looking for.` | |

### Deleting a project preference [¶](https://docs.getodk.org/central-api-accounts-and-users/\#deleting-a-project-preference "Link to this heading")

**DELETE /v1/user-preferences/project/{projectId}/{propertyName}**

Request

**Parameters**

|     |     |
| --- | --- |
| `projectId` | `integer`<br>The integer ID of the `Project`.<br>Example: `42` |
| `propertyName` | `string`<br>The name of the preference.<br>Example: `frobwazzleEnabled` |

Response

**HTTP Status: 200**

Content Type: application/json

Example

```
{
  "success": true
}
```

Copy to clipboard

Schema

|     |     |
| --- | --- |
| object

|     |     |
| --- | --- |
| `success` | `boolean` | |

**HTTP Status: 404**

Content Type: application/json

Example

```
{
  "code": 404.1,
  "message": "Could not find the resource you were looking for."
}
```

Copy to clipboard

Schema

|     |     |
| --- | --- |
| object

|     |     |
| --- | --- |
| `code` | `number`<br>Example: `404.1` |
| `message` | `string`<br>Example: `Could not find the resource you were looking for.` | |

### Setting a sitewide preference [¶](https://docs.getodk.org/central-api-accounts-and-users/\#setting-a-sitewide-preference "Link to this heading")

**PUT /v1/user-preferences/site/{propertyName}**

Request

**Parameters**

|     |     |
| --- | --- |
| `propertyName` | `string`<br>The name of the preference.<br>Example: `frobwazzleEnabled` |

**Request body**

Example

```
{
  "propertyValue": true
}
```

Copy to clipboard

Schema

|     |     |
| --- | --- |
| None

|     |     |
| --- | --- |
| `propertyValue` | `None`<br>The preference to be stored. It may be of any json-serializable type. | |

Response

**HTTP Status: 200**

Content Type: application/json

Example

```
{
  "success": true
}
```

Copy to clipboard

Schema

|     |     |
| --- | --- |
| object

|     |     |
| --- | --- |
| `success` | `boolean` | |

### Deleting a sitewide preference [¶](https://docs.getodk.org/central-api-accounts-and-users/\#deleting-a-sitewide-preference "Link to this heading")

**DELETE /v1/user-preferences/site/{propertyName}**

Request

**Parameters**

|     |     |
| --- | --- |
| `propertyName` | `string`<br>The name of the preference.<br>Example: `frobwazzleEnabled` |

Response

**HTTP Status: 200**

Content Type: application/json

Example

```
{
  "success": true
}
```

Copy to clipboard

Schema

|     |     |
| --- | --- |
| object

|     |     |
| --- | --- |
| `success` | `boolean` | |

**HTTP Status: 404**

Content Type: application/json

Example

```
{
  "code": 404.1,
  "message": "Could not find the resource you were looking for."
}
```

Copy to clipboard

Schema

|     |     |
| --- | --- |
| object

|     |     |
| --- | --- |
| `code` | `number`<br>Example: `404.1` |
| `message` | `string`<br>Example: `Could not find the resource you were looking for.` | |

## App Users [¶](https://docs.getodk.org/central-api-accounts-and-users/\#app-users "Link to this heading")

App Users may only be created, fetched, and manipulated within the nested Projects subresource, as App Users themselves are limited to the Project in which they are created. Through the `App User`s API, you can create, list, and delete the App Users of any given Project. Because they have extremely limited permissions, App Users cannot manage themselves; only `User`s may access this API.

For more information about the `/projects` containing resource, please see the following section.

### Listing all App Users [¶](https://docs.getodk.org/central-api-accounts-and-users/\#listing-all-app-users "Link to this heading")

**GET /v1/projects/{projectId}/app-users**

Currently, there are no paging or filtering options, so listing `App User`s will get you every App User in the system, every time.

This endpoint supports retrieving extended metadata; provide a header `X-Extended-Metadata: true` to additionally retrieve the `lastUsed` timestamp of each App User, as well as to retrieve the details of the `Actor` the App User was `createdBy`.

Request

**Parameters**

|     |     |
| --- | --- |
| `projectId` | `number`<br>The numeric ID of the Project<br>Example: `7` |

Response

**HTTP Status: 200**

Content Type: application/json

Example

```
[$
  {$
    "createdAt": "2018-04-18T23:19:14.802Z",$
    "displayName": "My Display Name",$
    "id": 115,$
    "type": "user",$
    "updatedAt": "2018-04-18T23:42:11.406Z",$
    "deletedAt": "2018-04-18T23:42:11.406Z",$
    "token": "d1!E2GVHgpr4h9bpxxtqUJ7EVJ1Q$Dusm2RBXg8XyVJMCBCbvyE8cGacxUx3bcUT",$
    "projectId": 1,$
    "lastUsed": "2018-04-14T08:34:21.633Z"$
  }$
]
```

Copy to clipboard

Schema

|     |     |
| --- | --- |
| array

|     |     |
| --- | --- |
| `createdAt` | `string`<br>ISO date format<br>Example: `2018-04-18 23:19:14.802000+00:00` |
| `displayName` | `string`<br>All `Actor`s, regardless of type, have a display name<br>Example: `My Display Name` |
| `id` | `number`<br>Example: `115.0` |
| `type` | `enum`

The type of actor

expand

|     |     |
| --- | --- |
| `user` | `string` |
| `field_key` | `string` |
| `public_link` | `string` |
| `singleUse` | `string` | |
| `updatedAt` | `string`<br>ISO date format<br>Example: `2018-04-18 23:42:11.406000+00:00` |
| `deletedAt` | `string`<br>ISO date format<br>Example: `2018-04-18 23:42:11.406000+00:00` |
| `token` | `string`<br>If present, this is the Token that can be used to authenticate a request as this `App User`. If not present, this `App User`'s access has been revoked.<br>Example: `d1!E2GVHgpr4h9bpxxtqUJ7EVJ1Q$Dusm2RBXg8XyVJMCBCbvyE8cGacxUx3bcUT` |
| `projectId` | `number`<br>The ID of the `Project` that this `App User` is bound to.<br>Example: `1` | |

**HTTP Status: 200**

Content Type: application/json; extended

Example

```
[$
  {$
    "createdAt": "2018-04-18T23:19:14.802Z",$
    "displayName": "My Display Name",$
    "id": 115,$
    "type": "user",$
    "updatedAt": "2018-04-18T23:42:11.406Z",$
    "deletedAt": "2018-04-18T23:42:11.406Z",$
    "token": "d1!E2GVHgpr4h9bpxxtqUJ7EVJ1Q$Dusm2RBXg8XyVJMCBCbvyE8cGacxUx3bcUT",$
    "projectId": 1,$
    "createdBy": {$
      "createdAt": "2018-04-18T23:19:14.802Z",$
      "displayName": "My Display Name",$
      "id": 115,$
      "type": "user",$
      "updatedAt": "2018-04-18T23:42:11.406Z",$
      "deletedAt": "2018-04-18T23:42:11.406Z"$
    },$
    "lastUsed": "2018-04-14T08:34:21.633Z"$
  }$
]
```

Copy to clipboard

Schema

|     |     |
| --- | --- |
| array

|     |     |
| --- | --- |
| `createdAt` | `string`<br>ISO date format<br>Example: `2018-04-18 23:19:14.802000+00:00` |
| `displayName` | `string`<br>All `Actor`s, regardless of type, have a display name<br>Example: `My Display Name` |
| `id` | `number`<br>Example: `115.0` |
| `type` | `enum`

The type of actor

expand

|     |     |
| --- | --- |
| `user` | `string` |
| `field_key` | `string` |
| `public_link` | `string` |
| `singleUse` | `string` | |
| `updatedAt` | `string`<br>ISO date format<br>Example: `2018-04-18 23:42:11.406000+00:00` |
| `deletedAt` | `string`<br>ISO date format<br>Example: `2018-04-18 23:42:11.406000+00:00` |
| `token` | `string`<br>If present, this is the Token that can be used to authenticate a request as this `App User`. If not present, this `App User`'s access has been revoked.<br>Example: `d1!E2GVHgpr4h9bpxxtqUJ7EVJ1Q$Dusm2RBXg8XyVJMCBCbvyE8cGacxUx3bcUT` |
| `projectId` | `number`<br>The ID of the `Project` that this `App User` is bound to.<br>Example: `1` |
| `createdBy` | `object`

The `Actor` that created this `App User`

expand

|     |     |
| --- | --- |
| `createdAt` | `string`<br>ISO date format<br>Example: `2018-04-18 23:19:14.802000+00:00` |
| `displayName` | `string`<br>All `Actor`s, regardless of type, have a display name<br>Example: `My Display Name` |
| `id` | `number`<br>Example: `115.0` |
| `type` | `enum`

The type of actor

expand

|     |     |
| --- | --- |
| `user` | `string` |
| `field_key` | `string` |
| `public_link` | `string` |
| `singleUse` | `string` | |
| `updatedAt` | `string`<br>ISO date format<br>Example: `2018-04-18 23:42:11.406000+00:00` |
| `deletedAt` | `string`<br>ISO date format<br>Example: `2018-04-18 23:42:11.406000+00:00` | |
| `lastUsed` | `string`<br>ISO date format. The last time this `App User` was used to authenticate a request.<br>Example: `2018-04-14 08:34:21.633000+00:00` | |

### Creating a new App User [¶](https://docs.getodk.org/central-api-accounts-and-users/\#creating-a-new-app-user "Link to this heading")

**POST /v1/projects/{projectId}/app-users**

The only information required to create a new `App User` is its `displayName` (this is called "Nickname" in the administrative panel).

When an App User is created, they are assigned no rights. They will be able to authenticate and list forms on a mobile client, but the form list will be empty, as the list only includes Forms that the App User has read access to. Once an App User is created, you'll likely wish to use the [Form Assignments resource](https://docs.getodk.org/central-api-form-management/#form-assignments) to actually assign the `app-user` role to them for the Forms you wish.

Request

**Parameters**

|     |     |
| --- | --- |
| `projectId` | `number`<br>The numeric ID of the Project<br>Example: `7` |

**Request body**

Example

```
{
  "displayName": "My Display Name"
}
```

Copy to clipboard

Schema

|     |     |
| --- | --- |
| object

|     |     |
| --- | --- |
| `displayName` | `string`<br>The friendly nickname of the `App User` to be created. | |

Response

**HTTP Status: 200**

Content Type: application/json

Example

```
{
  "createdAt": "2018-04-18T23:19:14.802Z",
  "displayName": "My Display Name",
  "id": 115,
  "type": "user",
  "updatedAt": "2018-04-18T23:42:11.406Z",
  "deletedAt": "2018-04-18T23:42:11.406Z",
  "token": "d1!E2GVHgpr4h9bpxxtqUJ7EVJ1Q$Dusm2RBXg8XyVJMCBCbvyE8cGacxUx3bcUT",
  "projectId": 1
}
```

Copy to clipboard

Schema

|     |     |
| --- | --- |
| object

|     |     |
| --- | --- |
| `createdAt` | `string`<br>ISO date format |
| `displayName` | `string`<br>All `Actor`s, regardless of type, have a display name |
| `id` | `number` |
| `type` | `enum`

the Type of this Actor; typically this will be `user`.

expand

|     |     |
| --- | --- |
| `user` | `string` |
| `field_key` | `string` |
| `public_link` | `string` |
| `singleUse` | `string` | |
| `updatedAt` | `string`<br>ISO date format |
| `deletedAt` | `string`<br>ISO date format |
| `token` | `string`<br>If present, this is the Token that can be used to authenticate a request as this `App User`. If not present, this `App User`'s access has been revoked. |
| `projectId` | `number`<br>The ID of the `Project` that this `App User` is bound to. | |

**HTTP Status: 400**

Content Type: application/json

Example

```
{
  "code": "400",
  "message": "Could not parse the given data (2 chars) as json."
}
```

Copy to clipboard

Schema

|     |     |
| --- | --- |
| object

|     |     |
| --- | --- |
| `code` | `string` |
| `details` | `object`<br>a subobject that contains programmatically readable details about this error |
| `message` | `string` | |

### Deleting an App User [¶](https://docs.getodk.org/central-api-accounts-and-users/\#deleting-an-app-user "Link to this heading")

**DELETE /v1/projects/{projectId}/app-users/{id}**

You don't have to delete a `App User` in order to cut off its access. Using a `User`'s credentials you can simply [log the App User's session out](https://docs.getodk.org/central-api-authentication/#logging-out-current-session) using its token. This will end its session without actually deleting the App User, which allows you to still see it in the configuration panel and inspect its history. This is what the administrative panel does when you choose to "Revoke" the App User.

That said, if you do wish to delete the App User altogether, you can do so by issuing a `DELETE` request to its resource path. App Users cannot delete themselves.

Request

**Parameters**

|     |     |
| --- | --- |
| `id` | `number`<br>The numeric ID of the App User<br>Example: `16` |
| `projectId` | `number`<br>The numeric ID of the Project<br>Example: `7` |

Response

**HTTP Status: 200**

Content Type: application/json

Example

```
{
  "success": true
}
```

Copy to clipboard

Schema

|     |     |
| --- | --- |
| object

|     |     |
| --- | --- |
| `success` | `boolean` | |

## Roles [¶](https://docs.getodk.org/central-api-accounts-and-users/\#roles "Link to this heading")

_(introduced: version 0.5)_

The Roles API lists and describes each known Role within the system. Right now, Roles may not be created or customized via the API, but this will likely change in the future.

Each Role contains information about the verbs it allows its assignees to perform. Some Roles have a system name associated with them; the Roles may always be referenced by this system name in request URLs, and system Roles are always read-only.

### Listing all Roles [¶](https://docs.getodk.org/central-api-accounts-and-users/\#listing-all-roles "Link to this heading")

**GET /v1/roles**

Currently, there are no paging or filtering options, so listing `Role`s will get you every Role in the system, every time. There are no authorization restrictions upon this endpoint: anybody is allowed to list all Role information at any time.

Request

This endpoint doesn't take any request parameter or data

Response

**HTTP Status: 200**

Content Type: application/json

Example

```
[$
  {$
    "id": 4,$
    "name": "Project Manager",$
    "system": "manager",$
    "verbs": [$
      "project.update",$
      "project.delete"$
    ],$
    "createdAt": "2018-01-19T23:58:03.395Z",$
    "updatedAt": "2018-03-21T12:45:02.312Z"$
  }$
]
```

Copy to clipboard

Schema

|     |     |
| --- | --- |
| array

|     |     |
| --- | --- |
| `id` | `number`<br>The numerical ID of the Role.<br>Example: `4` |
| `name` | `string`<br>The human-readable name for the Role.<br>Example: `Project Manager` |
| `system` | `string`<br>The system name of the Role. Roles that have system names may not be modified.<br>Example: `manager` |
| `verbs` | `array`<br>The array of string verbs this Role confers.<br>Example: `["project.update", "project.delete"]` |
| `createdAt` | `string`<br>ISO date format<br>Example: `2018-04-18 23:42:11.406000+00:00` |
| `updatedAt` | `string`<br>ISO date format<br>Example: `2018-09-18 23:42:11.406000+00:00` | |

### Getting Role Details [¶](https://docs.getodk.org/central-api-accounts-and-users/\#getting-role-details "Link to this heading")

**GET /v1/roles/{id}**

Getting an individual Role does not reveal any additional information over listing all Roles. It is, however, useful for direct lookup of a specific role:

The `id` parameter for Roles here and elsewhere will accept the numeric ID associated with that Role, _or_ a `system` name if there is one associated with the Role. Thus, you may request `/v1/roles/admin` on any ODK Central server and receive information about the Administrator role.

As with Role listing, there are no authorization restrictions upon this endpoint: anybody is allowed to get information about any Role at any time.

Request

**Parameters**

|     |     |
| --- | --- |
| `id` | `string`<br>Typically the integer ID of the `Role`. You may also supply the Role `system` name if it has one.<br>Example: `1` |

Response

**HTTP Status: 200**

Content Type: application/json

Example

```
{
  "id": 4,
  "name": "Project Manager",
  "system": "manager",
  "verbs": [$
    "project.update",$
    "project.delete"$
  ],
  "createdAt": "2018-01-19T23:58:03.395Z",
  "updatedAt": "2018-03-21T12:45:02.312Z"
}
```

Copy to clipboard

Schema

|     |     |
| --- | --- |
| object

|     |     |
| --- | --- |
| `id` | `number`<br>The numerical ID of the Role.<br>Example: `4` |
| `name` | `string`<br>The human-readable name for the Role.<br>Example: `Project Manager` |
| `system` | `string`<br>The system name of the Role. Roles that have system names may not be modified.<br>Example: `manager` |
| `verbs` | `array`<br>The array of string verbs this Role confers.<br>Example: `["project.update", "project.delete"]` |
| `createdAt` | `string`<br>ISO date format<br>Example: `2018-04-18 23:42:11.406000+00:00` |
| `updatedAt` | `string`<br>ISO date format<br>Example: `2018-09-18 23:42:11.406000+00:00` | |

## Assignments [¶](https://docs.getodk.org/central-api-accounts-and-users/\#assignments "Link to this heading")

_(introduced: version 0.5)_

There are multiple Assignments resources. This one, upon the API root (`/v1/assignments`), manages Role assignment to the entire system (e.g. if you are assigned a Role that gives you `form.create`, you may create a form anywhere on the entire server).

The [Project Assignments resource](https://docs.getodk.org/central-api-project-management/#project-assignments), nested under Projects, manages Role assignment to that Project in particular, and all objects within it. And the [Form Assignments resource](https://docs.getodk.org/central-api-form-management/#form-assignments) allows even more granular assignments, to specific Forms within a Project. All of these resources have the same structure and take and return the same data types.

Assignments may be created (`POST`) and deleted (`DELETE`) like any other resource in the system. Here, creating an Assignment grants the referenced Actor the verbs associated with the referenced Role upon all system objects. The pathing for creation and deletion is not quite REST-standard: we represent the relationship between Role and Actor directly in the URL rather than as body data: `assignments/{role}/{actor}` represents the assignment of the given Role to the given Actor.

### Listing all Assignments [¶](https://docs.getodk.org/central-api-accounts-and-users/\#listing-all-assignments "Link to this heading")

**GET /v1/assignments**

This will list every server-wide assignment, in the form of `actorId`/`roleId` pairs. It will _not_ list Project-specific Assignments. To find those, you will need the [Assignments subresource](https://docs.getodk.org/central-api-project-management/#project-assignments) within Projects.

This endpoint supports retrieving extended metadata; provide a header `X-Extended-Metadata: true` to expand the `actorId` into a full `actor` objects. The Role reference remains a numeric ID.

Request

This endpoint doesn't take any request parameter or data

Response

**HTTP Status: 200**

Content Type: application/json

Example

```
[$
  {$
    "actorId": 115,$
    "roleId": 4$
  }$
]
```

Copy to clipboard

Schema

|     |     |
| --- | --- |
| array

|     |     |
| --- | --- |
| `actorId` | `number`<br>The numeric Actor ID being assigned.<br>Example: `42` |
| `roleId` | `number`<br>The numeric Role ID being assigned.<br>Example: `4` | |

**HTTP Status: 200**

Content Type: application/json; extended

Example

```
[$
  {$
    "actor": {$
      "createdAt": "2018-04-18T23:19:14.802Z",$
      "displayName": "My Display Name",$
      "id": 115,$
      "type": "user",$
      "updatedAt": "2018-04-18T23:42:11.406Z",$
      "deletedAt": "2018-04-18T23:42:11.406Z"$
    },$
    "roleId": 4$
  }$
]
```

Copy to clipboard

Schema

|     |     |
| --- | --- |
| array

|     |     |
| --- | --- |
| `actor` | `object`

The full Actor data for this assignment.

expand

|     |     |
| --- | --- |
| `createdAt` | `string`<br>ISO date format<br>Example: `2018-04-18 23:19:14.802000+00:00` |
| `displayName` | `string`<br>All `Actor`s, regardless of type, have a display name<br>Example: `My Display Name` |
| `id` | `number`<br>Example: `115.0` |
| `type` | `enum`

The type of actor

expand

|     |     |
| --- | --- |
| `user` | `string` |
| `field_key` | `string` |
| `public_link` | `string` |
| `singleUse` | `string` | |
| `updatedAt` | `string`<br>ISO date format<br>Example: `2018-04-18 23:42:11.406000+00:00` |
| `deletedAt` | `string`<br>ISO date format<br>Example: `2018-04-18 23:42:11.406000+00:00` | |
| `roleId` | `number`<br>The numeric Role ID being assigned.<br>Example: `4` | |

### Listing all Actors assigned some Role [¶](https://docs.getodk.org/central-api-accounts-and-users/\#listing-all-actors-assigned-some-role "Link to this heading")

**GET /v1/assignments/{roleId}**

Given a `roleId`, which may be a numeric ID or a string role `system` name, this endpoint lists all `Actors` that have been assigned that Role on a server-wide basis.

Request

**Parameters**

|     |     |
| --- | --- |
| `roleId` | `string`<br>Typically the integer ID of the `Role`. You may also supply the Role `system` name if it has one.<br>Example: `admin` |

Response

**HTTP Status: 200**

Content Type: application/json

Example

```
[$
  {$
    "createdAt": "2018-04-18T23:19:14.802Z",$
    "displayName": "My Display Name",$
    "id": 115,$
    "type": "user",$
    "updatedAt": "2018-04-18T23:42:11.406Z",$
    "deletedAt": "2018-04-18T23:42:11.406Z"$
  }$
]
```

Copy to clipboard

Schema

|     |     |
| --- | --- |
| array

|     |     |
| --- | --- |
| `createdAt` | `string`<br>ISO date format<br>Example: `2018-04-18 23:19:14.802000+00:00` |
| `displayName` | `string`<br>All `Actor`s, regardless of type, have a display name<br>Example: `My Display Name` |
| `id` | `number`<br>Example: `115.0` |
| `type` | `enum`

The type of actor

expand

|     |     |
| --- | --- |
| `user` | `string` |
| `field_key` | `string` |
| `public_link` | `string` |
| `singleUse` | `string` | |
| `updatedAt` | `string`<br>ISO date format<br>Example: `2018-04-18 23:42:11.406000+00:00` |
| `deletedAt` | `string`<br>ISO date format<br>Example: `2018-04-18 23:42:11.406000+00:00` | |

### Assigning an Actor to a server-wide Role [¶](https://docs.getodk.org/central-api-accounts-and-users/\#assigning-an-actor-to-a-server-wide-role "Link to this heading")

**POST /v1/assignments/{roleId}/{actorId}**

Given a `roleId`, which may be a numeric ID or a string role `system` name, and a numeric `actorId`, assigns that Role to that Actor across the entire server.

No `POST` body data is required, and if provided it will be ignored.

Request

**Parameters**

|     |     |
| --- | --- |
| `roleId` | `string`<br>Typically the integer ID of the `Role`. You may also supply the Role `system` name if it has one.<br>Example: `admin` |
| `actorId` | `number`<br>The integer ID of the `Actor`.<br>Example: `14` |

Response

**HTTP Status: 200**

Content Type: application/json

Example

```
{
  "success": true
}
```

Copy to clipboard

Schema

|     |     |
| --- | --- |
| object

|     |     |
| --- | --- |
| `success` | `boolean` | |

### Stripping an Role Assignment from an Actor [¶](https://docs.getodk.org/central-api-accounts-and-users/\#stripping-an-role-assignment-from-an-actor "Link to this heading")

**DELETE /v1/assignments/{roleId}/{actorId}**

Given a `roleId`, which may be a numeric ID or a string role `system` name, and a numeric `actorId`, unassigns that Role from that Actor across the entire server.

Request

**Parameters**

|     |     |
| --- | --- |
| `roleId` | `string`<br>Typically the integer ID of the `Role`. You may also supply the Role `system` name if it has one.<br>Example: `admin` |
| `actorId` | `number`<br>The integer ID of the `Actor`.<br>Example: `14` |

Response

**HTTP Status: 200**

Content Type: application/json

Example

```
{
  "success": true
}
```

Copy to clipboard

Schema

|     |     |
| --- | --- |
| object

|     |     |
| --- | --- |
| `success` | `boolean` | |

Did this page help you?

Selecting an option will open a 1-question survey

[👍 Yes](https://data.getodk.cloud/-/single/Wwm9bRuxrPz0W9Sh7fUoXpr101dAzJs?st=UBXshGpbpre4xGXNT1iMO5WM2TO$XZuHzI2!a4RKQJB6z6h$Tksz9sskvVS9eA$j&d[/data/helped]=yes&d[/data/page]=Accounts%20and%20Users)[👎 No](https://data.getodk.cloud/-/single/Wwm9bRuxrPz0W9Sh7fUoXpr101dAzJs?st=UBXshGpbpre4xGXNT1iMO5WM2TO$XZuHzI2!a4RKQJB6z6h$Tksz9sskvVS9eA$j&d[/data/helped]=no&d[/data/page]=Accounts%20and%20Users)

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)