
**Agents**

*Simple agent : (/modules/simple_ai.js)*
A simple interactive musical agent agent that triggers percussive hits with the
same loudness as the current volume recieved from the microphone.

*Agent changes hits: (/modules/ai_hitchange.js)*

The agent periodically changes the hits in the playing. The agent uses a poisson
process specified by the rate at which changes are introduced. The agent decides
a change ahead of time with an exponential model. At every iteration the agent
checks if the time for change has arrived. If it senses that it is close to the
time of change, then the agent selects one of the percussive hits s at random to
implement the change. Otherwise, the agent maintains its current playing.

*Agent changes hit and density (/modules/ai_hit_timbre_change.js)*

The agent presented here is similar to the previous agent but has two counters
that are running for two different music generation parameter - density and
timbre, with two different poisson distributions at different rates. For each
dimension, the agent sets a certain trajectory, ie. the next point at which it
will change a particular music generation parameter. Other parameters may change
during this trajectory according to their change rates, but the controlled
parameter remains constant till the it's next time of change arrives. Parameters
that change more frequently than others are the parameters that the agent can
change to interact with the user. Parameters that change less frequently are the
parameters that are held constant during a given interval.

*Agent transitions (/modules/ai_transition.js)*

The agent generates performances with transitions in two parameters - density
and timbre change. The transitions are created by changing the lambdas (rate of
event generation in the poisson processes) of the respective paramters. The rate
of changes of lambdas is once in 50 beats (average of 12.5 seconds). The agent
moves between four regions of low density, low timbral variation to high density
and high timbral variation.

*Agent adaptive lag (/modules/ai_interactive.js)*

The agent decides whether to transition or not based on the recognizing
significant moments of change in the music. The frequent recognition of
differences corresponds to a situation where the the musicians are constantly
disagreeing and negotiating (about the purpose of thier interaction) in the
section. Infrequent differences means that the musicians are on page and in sync
about what they are doing. The time between the recognition of the change and
taking actions in response is called the adaptive lag. The recognition of
differences is governed by an exponential process that triggers at the rate of 5
seconds (i.e., there are differences around every 5 seconds). The rate of
resolution of differences is 10 seconds (i.e., the agent responds to a
difference that occurs NOW within a span of 10 seconds). The console displays
the adaptive lag for the agent.

* Agent interactive modes (/modules/ai_interactive_mode.js)*

 The agent has two interactive modes - imitation and complimentarity that
 determine its' response to the user while playing. The main differenes in the
 interaction modes with regards to the behavior of the agent is that when the
 agent is playing in a homogenous interaction mode, the agent mimicks the
 musician's volume when it is playing. In the complementary mode, the agent
 inverts the user's volume when it is playing. In the imitation, the agent is
 silent when the user is silent. However, if there is a mode shift, then the
 agent suddnely starts playing with an inverted volume as that of the musician.
 This does lead to an interesting annd unpredictable interaction. The
 interaction modes change at a rate of 1/40, or once every 10 seconds.

**Other snippets:**

Arduino connection: The processing file (footpedal.inp) is the processing code
for using a press pedal (or a button) to register and register binary events.

**INSTALLATION notes**

The module serial port has to installed as :
sudo npm install serialport --unsafe-perm --build-from-source

**Things to do:**

1) Display points of serial presses index by time ( on stop )

2) Log serial events as objects and store them as a file.

3) Log performances as wav/mp3 files (maybe inbuilt mac features are available)

4) play/pause toggle with space bar and move forward/backward to different
points in the recorded performance with arrow keys.



Write up/Observations from interaction

The interaction between musicians is characterized as two streams of events
occurring at different rates. The only input that the uses from the user that is
used in the response is the microphone input. The agent responds by playing back
at the same level of volume as obtained from the input.

At the lowest level, the events are characterized as sequence of hits. The agent
changes the timbre of the hits at certain rate as specified by an exponential
function.

At a higher level of abstraction, the events are characterized by their density,
and variation in timbral content. These are the two main parameters that are
varied in the experiment.

The different parameters of density and timbral variation themselves vary over
the course of the performance with musicians sparse and dense textures. Thus at
an even higher level, the rate of change of density and the rate of timbral
content are themselves varying at a certain rate. The magnitude of changes are
independent (and it might sometimes not feel like one of them has changed) The
variation of different parameters lead to changes in the musical surface and are
transitions.

Musicians often recognize salient points or points of difference that prompt
them to make actions in the improvisation. These salient events are generated
through an event generation process that happens at a certain rates.

In an interactive performance, there is an adaptive lag between the moment of
recognition of changes, and the actions taken in response. The adaptive lag,
here, is the time between the recognition of salient events and the time at
which the agent is ready to make a change. This adaptive, when less than 10
seconds, results in performances that feel interactive. The adaptive lag is
adjusted through the average interval with which the agent changes its parameter
rates.

An agent that merely interacts in one way - as an imitator - does not result in
temporally rich interactions that are often observe in musical interaction
(e.g., turn taking, fast transitions between leading and accompanying). the
agent's interaction capabilities are expanded with two modes of playing -
imitation and complementarity. In the imitation mode, agent at the same level of
volume as obtained from the input. In the complementary mode, agent plays at the
inverse level of the volume as obtained from the input. This gives a sense of
leadership to the agent during the times that the musician is silent.

This agent is interesting to play with - but has certain problems that need to
be addressed.

1) keeping the overall theme of the perforamnce predictable. Right now, the
   agent gives unpredictable performances - even though there is a larger
   distribution that guides the changes in agent's playing characteristics and
   modes, the magnitude of change is unclear. In other words, in some
   performances, the agent starts from low values of density and goes to high
   value, and in others agent starts from low values and stays low. To what
   extent should musicians have a sense of where the agent should start and
   where it should end?
2) the agent's intentions are often unclear - sometimes the agent stops and it
   is not clear whether it stopped because its' density is low or because of
   it's interaction mode - copying the musician and the musician is not playing.
   This makes evaluation difficult. This might be addressed when musicians have
   a sense of where the agent should be in the performance and where it is.
3) the agent still does not feel like a partner


1) time taken to move from recognizing change to implementing - manner of change
- the system keeps recognizing new events and new changes and adds the change
that is based on what it finally recognized as the difference. Is that a
sufficient resolution?

2) agent's intentions can be made more clear may be with a score - that
describes that magnitude and the direction of changes in the parameters (for
example from high region to low region or low region to a high region)?

4) Should the agent attempt to reduce the adaptive lag on recognizing it? Does
the recognition of an adaptive lag alter the magnitude of change in the lower
level parameters?

5) Is exponential decay the correct model?
