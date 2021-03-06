# Universal Recommender Tuning
The default settings of the UR are good for many purposes but getting optimum results may require tuning and at very least many users will wish to know the meaning of the various tuning params.

## UR Parameters v0.4.0

**Notice:** This version requires you to build Mahout v0.13.0-SNAPSHOT from source. If you do not need v0.4.0 features you can stick with v0.3.0 by pulling that tag from the UR repo. See git instructions to pull and checkout a specific tag. To use v0.4.0 You will need to pull the latest master of Mahout v0.13.0 from the [Apache Mahout repo](https://github.com/apache/mahout.git) and build it locally on the machine you expect to build the Universal Recommender. We will update the UR as soon as Mahout v0.13.0 is released to avoid this extra build. Also notice that this version is not compatible with Apache PredcitionIO v0.10.0 since it has not been released yet. Continue to use the ActionML version of PredictionIO-0.9.7-aml.

### Start Here: Find Your Primary Conversion Indicator

To start using a recommender you must have a primary indicator of user preference. This is sometimes called the "conversion" event. If it is not obvious ask yourself 2 questions:

 1. *"What item type do I want to recommend?"* For ecom this will be a product, for media it will be a story or video.
 2. *"Of all the data I have what is the most pure and unambiguous indication of user preference for this item?"* For ecom a "buy" is good, for media a "read" or "watch90" (for watching 90% of a video). Try to avoid ambiguous things like ratings, after all what does a rating of 3 mean for a 1-5 range? Does a rating of 2 mean a like or dislike? If you have ratings then 4-5 is a pretty unambiguous "like" so the other ratings may not apply to a primary indicator&mdash;though they may still be useful so read on.
 
Take the item from #1, the indicator-name from #2 and the user-id and you have the data to create a "primary indicator" of the form **(user-id, "indicator-name", item-id)**. 

### Secondary Indicators

**There must be a "primary indicator" recorded for some number of users**. This  defines the type of item returned in recommendations and is the thing by which all secondary data is measured. More technically speaking all secondary data is tested for correlation to the primary indicator. Secondary data can be anything that you may think of as giving some insight into the user's taste. If something in the secondary data has no correlation to the primary indicator it will have no effect on recommendations. For instance in an ecom setting you may want "buy" as a primary event. There may be many (but none is also fine) secondary events like (user-id, device-preference, device-id). This can be thought of as a user's device preference and recorded at all logins. If this does not correlate to items bought it will not effect recommendations. 

### Biases

These take the form of boosts and filters where a neutral bias is 1.0. The importance of some part of the query may be boosted by a positive non-zero float. If the bias is < 0 it is considered a filter&mdash;meaning no recommendation is made that lacks the filter value(s). 

Think of bias as a multiplier to the score of the items that meet the condition so if bias = 2, and item-1 meets the condition, then multiply item-1's score times the bias. After all biases are applied the recommendations are returned ranked by score. The effect of bias is to:

 - Bias from 0 to < 1 : lower ranking for items that match the condition
 - Bias = 1: no effect
 - Bias > 1: raise the ranking for items that match the condition.
 - Bias < 0: A negative bias will **only** return items that meet the condition, so in other words it filters out any that do not meet all the conditions

One example of a filter is where it may make sense to show only "electronics" recommendations when the user is viewing an electronics product. Biases are often applied to a list of data, for instance the user is looking at a video page with a cast of actors. The "cast" list is metadata attached to items and a query can show "people who liked this, also liked these" type recommendations but also include the current cast boosted by 1.01. This can be seen as showing similar item recommendations but using the cast members to gently boost the similar items (since by default they have a neutral 1.0 boost). The result would be similar items favoring ones with similar cast members.

### Dates

Dates are only used for filters but apply in all recommendation modes including popularity queries. Dates can be used to filter recommendations in one of two ways, which should **never be used together**. Decide if you want the date range attached to queries or to the items themselves (for example available/expire dates) where the date range is attached to items or is specified in the query (for example the publish date between some range in a query). See [Date Range Filters](/docs/ur_advanced_tuning/#date_filters) for details.

### Engine.json

This file allows the user to describe and set parameters that control the engine operations. Many values have defaults so the following can be seen as the minimum for an ecom app with only one "buy" event. Reasonable defaults are used so try this first and add tunings or new event types and item property fields as you become more familiar.

#### Simple Default Values
    {
	  "comment":" This config file uses default settings for all but the required values see README.md for docs",
	  "id": "default",
	  "description": "Default settings",
	  "engineFactory": "org.template.RecommendationEngine",
	  "datasource": {
	    "params" : {
	      "name": "datasource-name",
	      "appName": "handmade",
	      "eventNames": ["purchase", "view"]
	    }
	  },
	  "sparkConf": {
	    "spark.serializer": "org.apache.spark.serializer.KryoSerializer",
	    "spark.kryo.registrator": "org.apache.mahout.sparkbindings.io.MahoutKryoRegistrator",
	    "spark.kryo.referenceTracking": "false",
	    "spark.kryoserializer.buffer.mb": "300",
	    "spark.kryoserializer.buffer": "300m",
	    "spark.executor.memory": "4g",
	    "es.index.auto.create": "true"
	  },
	  "algorithms": [
	    {
	      "comment": "simplest setup where all values are default, popularity based backfill, must add eventsNames",
	      "name": "ur",
	      "params": {
	        "appName": "handmade",
	        "indexName": "urindex",
	        "typeName": "items",
	        "comment": "must have data for the first event or the model will not build, other events are optional",
	        "eventNames": ["purchase", "view"]
	      }
	    }
	  ]
	}
	
#### Full Prameters

A full list of tuning and config parameters is below. See the field description for specific meaning. Some of the parameters work as defaults values for every query and can be overridden or added to in the query other parameters control model building.

**Note:** It is strongly advised that you try the default/simple settings first before changing them. The exception is that at least one event name must be put in the  `eventNames` array and the path to the Elasticsearch index must be specified in `indexName` and `typeName`. 

    {
      "id": "default",
      "description": "Default settings",
      "comment": "replace this with your JVM package prefix, like org.apache",
      "engineFactory": "org.template.RecommendationEngine",
      "datasource": {
        "params" : {
          "name": "some-data",
          "appName": "URApp1",
          "eventNames": ["buy", "view"]
          "eventWindow": {
	        "duration": "3650 days",
            "removeDuplicates": false,
            "compressProperties": false
	      } 
       }
     },
      “comment”: “This is for Mahout and Elasticsearch, the values are minimums and should not be removed”,
      "sparkConf": {
        "spark.serializer": "org.apache.spark.serializer.KryoSerializer",
        "spark.kryo.registrator": "org.apache.mahout.sparkbindings.io.MahoutKryoRegistrator",
        "spark.kryo.referenceTracking": "false",
        "spark.kryoserializer.buffer.mb": "200",
        "spark.executor.memory": "4g",
        "es.index.auto.create": "true"
      },
      "algorithms": [
        {
          "name": "ur",
          "params": {
            "appName": "app1",
            "indexName": "urindex",
            "typeName": "items",
            "eventNames": ["buy", "view"]
            "indicators": [
                {
                    "name": "purchase"
                },{
                    "name": "view",
                    "maxCorrelatorsPerItem": 50
                }
            ],
            "blacklistEvents": ["buy", "view"],
            "maxEventsPerEventType": 500,
            "maxCorrelatorsPerEventType": 50,
            "maxQueryEvents": 100,
            "num": 20,
            "seed": 3,
            "recsModel": "all",
			"rankings": [
              {
                "name": "popRank"
                "type": "popular", // or "trending" or "hot"
                "eventNames": ["buy", "view"],
                "duration": "3 days",
                "endDate": "ISO8601-date" // most recent date to end the duration
              },
              {
                "name": "uniqueRank"
                "type": "random"
              },
              {
                "name": "weightRank"
                "type": "userDefined"
              }
            ],
            "expireDateName": "expireDateFieldName",
            "availableDateName": "availableDateFieldName",
            "dateName": "dateFieldName",
            "userbias": -maxFloat..maxFloat,
            "itembias": -maxFloat..maxFloat,
            "returnSelf": true | false,
            “fields”: [
              {
                “name”: ”fieldname”,
                “values”: [“fieldValue1”, ...],
                “bias”: -maxFloat..maxFloat,
              },...
            ]
          }
        }
      ]
    }

#### Datasource Parameters

The `datasource: params:` section controls input data. This section is Algorithm independent and is meant to manage the size of data in the EventServer and do compaction. Is changes the persisted state of data. A fixed `timeWindow: duration:` will have the effect of making the UR calculate a model in a fixed amount of time as long as soon as there are enough events to start dropping old ones.

 - **eventNames**: enumerates the event types to be used. Required and must match either eventsNames or indicators in algorithms: params.
 - **eventWindow**: This is optional and controls how much of the data in the EventServer to keep and how to compress events. The default it to not have a time window and do no compression. This will compact and drop old events from the EventServer permanently in the persisted data&mdash;so make sure to have some other archive of events it you are playing with the `timeWindow: duration:`.
	 - **duration**: This is parsed for "days", "hours", "minutes", or smaller periods and becomes a Scala `Duration` object defining the time from now backward to the point where older events will be dropped. $set property change event are never dropped.
	 - **removeDuplicates** a boolean telling the Datasource to de-duplicate non$set type events, defaults to `false`.
	 - **compressProperties**: a boolean telling the Datasource to compress property change event into one event expressing the current state of all properties, defaults to `false`.

#### Algorithm Parameters

The `Algorithm: params:` section controls most of the features of the UR. Possible values are:

* **appName**: required string describing the app using the engine. Must be the same as is seen with `pio app list`
* **indexName**: required string describing the index for all correlators, something like "urindex". The Elasticsearch URI for its REST interface is `http:/**elasticsearch-machine**/indexName/typeName/...` You can access ES through its REST interface here.
* **typeName**: required string describing the type in Elasticsearch terminology, something like "items". This has no important meaning but must be part of the Elasticsearch URI for queries.
* **eventNames**: this OR the `indicators` array is required. An array of string identifiers describing action events recorded for users, things like “purchase”, “watch”, “add-to-cart”, even “location”, or “device” can be considered actions and used in recommendations. The first action is to be considered the primary action because it **must** exist in the data and is considered the strongest indication of user preference for items, the others are secondary for cooccurrence and cross-cooccurrence calculations. The secondary actions/events may or may not have target entity ids that correspond to the items to be recommended, so they are allowed to be things like category-ids, device-ids, location-ids... For example: a category-pref event would have a category-id as the target entity id but a view would have an item-id as the target entity id (see Events below). Both work fine as long as all usage events are tied to users. 
* **maxEventsPerEventType**: optional (use with great care), default = 500. Amount of usage history to keep use in model calculation.
* **maxCorrelatorsPerEventType**: optional, default = 50. this applies to all event types, use `indicators` to apply to specific event types&mdash;called indicators. An integer that controls how many of the strongest correlators are created for every event type named in `eventNames`.
* **indicators**: either this of `eventNames` are required. This method for naming event types also allows for setting downsampling per event type. These are more properly called "indicators" because they may not be triggered by events but always are assumed to be something known about users, which we think "indicates" something about their taste or preferences:
  * **name**: name for the indicator, as in eventNames.
  * **maxCorrelatorsPerItem**: number of correlated items per recommended item. This is set to give best results for the indicator type and is often set to less than 50 (the default value) if the number of different ids for this event type is small. For example if the indicator is "gender" there will only be 2 ids M and F so downsampleing may preform better if set to 1, which would find the gender that best correlates with a primary event on the recommended items like a purchase of a product. Without this setting the default of 50 would apply, meaning to take the top 50 gender ids that correlate with the primary/conversion item. With enough data you may get all genders to correlate, meaning none would be of higher value than another, meaning in turn that gender would not help recommend. Taking 1 correlator would force the UR to choose which is more highly correlated instead of taking up to 50 of the highest.
* **maxQueryEvents**: optional (use with great care), default = 100. An integer specifying the number of most recent user history events used to make recommendations for an individual. More implies some will be less recent actions. Theoretically using the right number will capture the user’s current interests.
* **num**: optional, default = 20. An integer telling the engine the maximum number of recommendations to return per query but less may be returned if the query produces less results or post recommendations filters like blacklists remove some.
* **blacklistEvents**: optional, default = the primary action. An array of strings corresponding to the actions taken on items, which will cause them to be removed from recommendations. These will have the same values as some user actions - so “purchase” might be best for an ecom application since there is often little need to recommend something the user has already bought. If this is not specified then the primary event is assumed. To blacklist no event, specify an empty array. Note that not all actions are taken on the same items being recommended. For instance every time a user goes to a category page this could be recorded as a category preference so if this event is used in a blacklist it will have no effect, the category and item ids should never match. If you want to filter certain categories, use a field filter and specify all categories allowed.
* **fields**: optional, default = none. An array of default field based query boosts and filters applied to every query. The name = type or field name for metadata stored in the EventStore with $set and $unset events. Values = and array of one or more values to use in any query. The values will be looked for in the field name. Bias will either boost the importance of this part of the query or use it as a filter. Positive biases are boosts any negative number will filter out any results that do not contain the values in the field name.
* **userBias**: optional (use with great care), default = none. Amount to favor user history in creating recommendations, 1 is neutral, and negative number means to use as a filter so the user history must be used in recommendations, any positive number greater than one will boost the importance of user history in recommendations.
* **itemBias**: optional (use with great care), default = none. Same as userbias but applied to similar items to the item supplied in the query.
* **expireDateName** optional, name of the item properties field that contains the date the item expires or is unavailable to recommend.
* **availableDateName** optional, name of the item properties field that contains the date the item is available to recommend. 
* **dateName** optional, a date or timestamp used in a `dateRange` recommendations filter.
* **returnSelf**: optional, default = false. Boolean asking to include the item that was part of the query (if there was one) as part of the results. The default is false and this is by far the most common use so this is seldom required.
* **recsModel** optional, default = "all", which means  collaborative filtering with popular items or other ranking method returned when no other recommendations can be made. Otherwise: "all", "collabFiltering", "backfill". If only "backfill" is specified then the train will create only some backfill or ranking type like popular. If only "collabFiltering" then no backfill will be included when there are no other recommendations.
* **rankings** optional, the default is to use only `"type": "popular"` counting all primary events. This parameter, when specified, is a list of ranking methods used to rank items as fill-in when not enough recommendations can be returned using the CCO algorithm. Popular items usually get the best results and so are the default. It is sometimes useful to be able to return any item, even if it does not have events (popular would not return these) so we allow random ranking as a method to return items. There may also be a user defined way to rank items so this is also supported.
     
  This parameter is a list of ranking methods that work in the order specified. For instance if popular is first and it cannot return enough items the next method in the list will be used&mdash;perhaps random. Random is always able to return all items defined so it should be last in the list. 
  
  When the `"type"` is **"popular", "trending", or "hot"** this set of parameters defines the calculation of the popularity model that ranks all items by their events in one of three different ways corresponding to: event counts (popular), change in event counts over time (trending), and change in trending over time (hot).
  
  When the `"type"` is **"random"** all items are ranked randomly regardless of any usage events. This is useful if some items have no events but you want to present them to users given no other method to recommend.
  
  When the `"type"` is **"userDefined"** the property defined in `"name"` is expected to rank any items that you wish to use as backfill. This may be useful, for instance, if you wish to show promoted items when no other method to recommend is possible. 
  
  In all cases the property value defined by `"name"` must be given a unique float value. For `"popular"`, `"trending"`, `"hot"`, and `"random"` the value is calculated by the UR. For `"userDefined"` the value is set using a `$set` event like any other property, only the value must be a float. See "Property Change Events" [here](http://actionml.com/docs/ur_input).
  
	* **name** give the field a name in the model and defaults to those mentioned above in the JSON.
	* **type**  `"popular"`, `"trending"`, `"hot"`, `"userDefined"`,and `"random"`. `"popular"`, `"trending"`, `"hot"` use event counts that are just count, velocity of change in event counts, or the acceleration of event counts respectively. **Note**: when using "hot" the algorithm divides the events into three periods and since events tend to be cyclical by day, 3 days will produce results mostly free of daily effects for all types. Making this time period smaller may cause odd effects from time of day the algorithm is executed. Popular is not split and trending splits the events in two. So choose the duration accordingly.
	* **eventNames** this is allowed only with one of the popularity types and is  array of eventNames to use in calculating the popularity model, this defaults to the primary/conversion event&mdash;the first in the `algorithm: eventNames:` list. 
	* **duration**  this is allowed only with one of the popularity type and is a duration like "3 days" (which is the default), which defines the time from now back to the last event to count in the popularity calculation.
	* **endDate**  this is allowed only with one of the popularity type and is an ISO8601-date string to use to start the duration&mdash;in other words it defines the first event to count. **This is almost never used a live system** but may be used in tests on batch imported events.
first event to count. This is almost never used live system but may be used in tests on batch imported events.
* **seed** Set this if you want repeatable downsampling for some offline tests. This can be ignored and shouldn't be set in production. 
