import { List, Toast, getPreferenceValues, showToast } from "@raycast/api";
import { simplifiedJourneys, SimplifiedJourney } from "sncf-api-wrapper";
import { Journey, Preferences } from "./types";
import { useEffect, useState } from "react";
import { dateToReadableDate } from "./utils/datetime";

type DetailProps = {
  journey: Journey;
}

export default function Detail(props: DetailProps) {
  const { journey } = props;
  const [journeys, setJourneys] = useState<SimplifiedJourney[]>([]);
  const [loading, setLoading] = useState(true);

  const preferences = getPreferenceValues<Preferences>();

  useEffect(() => {
    if (!journey) {
      return;
    }

    simplifiedJourneys(preferences.sncfApiKey, {
      from: journey.departure.code,
      to: journey.arrival.code,
      count: 5,
      data_freshness: 'realtime'
    }).then((response) => {
      setJourneys(response);
      setLoading(false);
    }).catch((e) => {
      console.log(e);
      showToast({
        title: "Error while searching for journeys",
        style: Toast.Style.Failure,
      });
    });
  }, [journey]);


  if (!journey) {
    return (
      <List>
        <List.EmptyView 
          title="No journey selected"
        />
      </List>
    )
  }

  return (
    <List isShowingDetail isLoading={loading}>
      {journeys.map((journey, index) => (
        <List.Item
          key={index}
          title={dateToReadableDate(journey.departureTime)}
          subtitle={journey.duration}
        />
      ))}
    </List>
  )
}