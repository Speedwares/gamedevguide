> In general, the more robust way to restore state like this is to store pre-animated state tokens for the animation. Using a pre-animated state token is more robust against the sort of issues that TearDown is more fragile, such as deleting tracks, re-assigning objects to tracks, overlapping sections that animate the same object etc etc. It also eliminates the need for the track itself to remember what its previous state was in many circumstances (which also can remove the need for persistent data).
>
> Here's a little background on how the pre-animated state caching works:
>
> FMovieScenePreAnimatedState is responsible for caching object state before an object is manipulated by sequencer, such that the object can be restored back to its original state when necessary. It does this in a way that can also work gracefully with overlapping sections that animate the object in the same way. A simple example would be an object's transform. Say you have 2 sections that want to animate an object's transform, and return it back to its original position when they are no longer evaluated:
>
>  

1.  \[ section 1 \]

2.  \[ section 2 \]

3.   

> Section 1 and section 2 both call SavePreAnimatedState, but the system internally will use the anim type ID to check whether it has already saved such state, and ref-count the state if necessary. This means that it doesn't matter in what order the sections begin or end, it will only ever cache the unanimated state, and only ever restore it when there is nothing else animating the object with that type ID.
>
> To use pre-animated state in this way, you can take the following approach:
>
>  

1.  struct FMyPreAnimatedStateToken : IMovieScenePreAnimatedToken

2.  {

3.  FMyPreAnimatedStateToken(UObject& UnAnimatedObject)

4.  {

5.  //... Cache off any data inside this token required to restore this object after we're done animating it

6.  }

7.  virtual void RestoreState(UObject& Object, IMovieScenePlayer& Player) override

8.  {

9.  //... Restore the object back to its previous state using the cached data from this token

10. }

11. };

12. struct FMyPreAnimatedStateProducer : IMovieScenePreAnimatedTokenProducer

13. {

14. virtual IMovieScenePreAnimatedTokenPtr CacheExistingState(UObject& Object) const override

15. {

16. return FMyPreAnimatedStateToken(Object);

17. }

18. };

19. /\*\*

20. \* Gets a single, unique identifier that represents a FMyPreAnimatedStateToken

21. \*/

22. static FMovieSceneAnimTypeID GetMyAnimationTypeID()

23. {

24. static FMovieSceneAnimTypeID TypeID = FMovieSceneAnimTypeID::Unique();

25. return TypeID;

26. }

27. // ------------------------------------------------------------------------------

28. void FMyExecutionToken::Execute(const FMovieSceneContext&, const FMovieSceneEvaluationOperand&, FPersistentEvaluationData& PersistentData, IMovieScenePlayer& Player)

29. {

30. // Explicitly passing an FMovieSceneEvaluationKey to SavePreAnimatedState will force the system to cache the token if necessary, regardless of the current capture state

31. FMovieSceneEvaluationKey CaptureForSection = PersistentData.GetSectionKey();

32. // Save the pre animated state for this object

33. Player.SavePreAnimatedState(\*Object, GetMyAnimationTypeID(), FMyPreAnimatedStateProducer(), CaptureForSection);

34. }

35.  

> If it is necessary for each section to always cache a token, and always restore it (regardless of overlapping, without the ref-counting mechanism), you can achieve this by passing a unique type ID for each section:
>
>  

1.  struct FMyPersistentData

2.  {

3.  FMovieSceneAnimTypeID AnimTypeID;

4.  FMyPersistentData() : AnimTypeID(FMovieSceneAnimTypeID::Unique()) {}

5.  };

6.  void FMyExecutionToken::Execute(const FMovieSceneContext&, const FMovieSceneEvaluationOperand&, FPersistentEvaluationData& PersistentData, IMovieScenePlayer& Player)

7.  {

8.  FMovieSceneAnimTypeID AnimTypeID = PersistentData.GetOrAdd&lt;FMyPersistentData&gt;().AnimTypeID;

9.  // Save the pre animated state for this object

10. FMovieSceneEvaluationKey CaptureForSection = PersistentData.GetSectionKey();

11. Player.SavePreAnimatedState(\*Object, AnimTypeID, FMyPreAnimatedStateProducer(), CaptureForSection);

12. }

13.  

14.  

15.  

> more ▼
>
> answered **Nov 06 '17 at 6:51 AM**
>
>  
>
> *From &lt;<https://udn.unrealengine.com/questions/399357/shouldnt-teardown-be-called-on-moviesceneevaltempl.html>&gt;*
>
>
