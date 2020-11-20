/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global abstract class DocTemplateMappingAbstractClass {
    global Id objectId;
    global Integer pageSize;
    global Map<String,Object> paginationOptionsMap;
    global Id templateId;
    global DocTemplateMappingAbstractClass() {

    }
    global abstract Integer getBatchDataCount(String param0);
    global abstract List<Object> getNextSet(String param0);
    global virtual Integer getPageSize(String sectionName) {
        return null;
    }
    global abstract Integer getStartIndex();
    global abstract Boolean hasNextSet(String param0);
    global virtual void initialize(Id contextId, Id documentTemplateId, Integer pageSize) {

    }
}
