# Solr Document Store

Solr Document Store for Corepo &amp; HoldingsItems index Documents
  
# Purpose  

To Hold and Track changes of Bibliographic and Item index values, 
to at different indexing Different parts of the Broend at different 
levels of [FRBS](https://en.wikipedia.org/wiki/Functional_Requirements_for_Bibliographic_Records#FRBR_entities)

To populate and update a SOLR schema with bibliographic documents including holdings and misc. search keys.

# Overview

Solr Document Store reads data from corepo and holdingsitems. And maintains its own PostgreSQL database with Bibliographic Records and HoldingsItems attached to those. 


![Overview](doc/solr-document-store-overview.png)

## Flow

When a Bibliographic item are updated the postgres database is updated and the key of the Bibliographic item is placed on an internal queue (implemented in postgres). The _Docstore worker_ reads the queue and updates SOLR with the changes.

## Definitions

* Corepo Documents (corepo) 

  Holds bibliographic Documents at the Manifestation level 

* Holdings Items Documents (holdingsitems)

  Holds Holdings Documents fragments at the Item level.


# Technical details

           
## JMeter 

The JMeter projects uses the following plugins from https://jmeter-plugins.org/wiki/PluginsManager/
   - Distribution/Percentile Graphs  https://jmeter-plugins.org/wiki/RespTimesDistribution/
  
           
## Testing 


