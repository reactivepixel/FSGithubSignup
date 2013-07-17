<form ng-submit="FSVerify()">

	<div class="input">
		<p ng-show="Msg" class="validate fail">Duplicate Email</p>
		<input ng-model="Email" type="text" name="email" placeholder="Full Sail Email" />
		<div ng-show="!Valid && Email" class="validate fail">{{Email}} not valid.</div>
		<div ng-show="Valid" class="validate pass">Hooray!</div>
	</div>

	<div class="input">
        <input type="submit" value="Verify Me" />
	</div>

</form>