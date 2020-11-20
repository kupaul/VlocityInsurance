<script type="text/ng-template" id="node_view">
  <div class="">
    <div class="panel-heading">
      <h4 class="panel-title">
          <span bs-collapse-toggle="{{$index}}" class="icon" ng-class="{'icon-v-right-arrow': parent.activeNodes.indexOf($index) < 0, 'icon-v-down-arrow': parent.activeNodes.indexOf($index) >= 0}" aria-hidden="true"></span>
        {{node.type}}: {{node.name}}
      </h4>
      
    </div>
    <div class="panel-collapse" bs-collapse-target="1">
      <div class="panel-body">
          <div class="fields">
             <div class="field" ng-repeat="field in node.fields" ng-if="field.value">
                 <span class="field-label">{{field.name}}:&nbsp;</span><span class="field-value">{{field.value}}</span>
             </div>
          </div>
          <div class="fields">
             <div class="field" ng-repeat="attr in node.attrs" ng-if="attr.value">
                 <span class="field-label">{{attr.name}}:&nbsp;</span><span class="field-value">{{attr.value}}</span>
             </div>
          </div>
          <div class="panel-group" ng-model="node.activeNodes" bs-collapse="{{node.activeNodes}}" data-allow-multiple="true" ng-if="node.nodes.length>0" ng-init="parent = node">
            <div class="panel " ng-repeat="node in node.nodes">
              <div class="oli-container" ng-include="'node_view'"></div>
            </div>
          </div>
      </div>
    </div>
  </div>
</script>