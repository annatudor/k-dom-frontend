import { Box } from "@chakra-ui/react";
import { HomeHeader } from "../components/home/HomeHeader";
import { FeedHeader } from "../components/home/FeedHeader";
import { FeedSection } from "../components/home/FeedSection";
import { PopularSection } from "../components/home/PopularSection";

export function Home() {
  return (
    <Box>
      <HomeHeader />

      <FeedHeader />
      <PopularSection />
      <FeedSection
        title="Popular K-Doms"
        viewAllUrl="/popular"
        popularItems={[
          {
            name: "BLACKPINK",
            wiki: "BLACKPINK Wiki",
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Blackpink_Pink_Carpet_Event_4.jpg/1200px-Blackpink_Pink_Carpet_Event_4.jpg",
          },
          {
            name: "Stray Kids",
            wiki: "Stray Kids Wiki",
            img: "https://www.musikexpress.de/wp-content/uploads/2023/09/microsoftteams-image-5-scaled.jpg",
          },
          {
            name: "BTS",
            wiki: "BTS Wiki",
            img: "https://people.com/thmb/48g8cusN8eDuq5VqzH_ry6Wz_OI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(999x0:1001x2)/bts-bb98ad807ef44aada577c4510c14bce4.jpg",
          },
          // adaugă mai multe iteme după nevoie
        ]}
        newsItems={[
          {
            id: 1,
            tag: "GROUPS",
            title: "BLACKPINK breaks another YouTube record",
            description: "The global girl group continues its reign ...",
            image: "https://link-imagine-1.jpg",
          },
          {
            id: 2,
            tag: "GROUPS",
            title: "Stray Kids announce world tour extension",
            description: "Due to overwhelming demand, new dates added ...",
            image: "https://link-imagine-2.jpg",
          },
          {
            id: 2,
            tag: "GROUPS",
            title: "Stray Kids announce world tour extension",
            description: "Due to overwhelming demand, new dates added ...",
            image: "https://link-imagine-2.jpg",
          },
          {
            id: 2,
            tag: "GROUPS",
            title: "Stray Kids announce world tour extension",
            description: "Due to overwhelming demand, new dates added ...",
            image: "https://link-imagine-2.jpg",
          },
          {
            id: 2,
            tag: "GROUPS",
            title: "Stray Kids announce world tour extension",
            description: "Due to overwhelming demand, new dates added ...",
            image: "https://link-imagine-2.jpg",
          },
          {
            id: 2,
            tag: "GROUPS",
            title: "Stray Kids announce world tour extension",
            description: "Due to overwhelming demand, new dates added ...",
            image: "https://link-imagine-2.jpg",
          },
          // alte știri ...
        ]}
      />
      <FeedSection
        title="Popular K-Doms"
        viewAllUrl="/popular"
        popularItems={[
          {
            name: "BLACKPINK",
            wiki: "BLACKPINK Wiki",
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Blackpink_Pink_Carpet_Event_4.jpg/1200px-Blackpink_Pink_Carpet_Event_4.jpg",
          },
          {
            name: "Stray Kids",
            wiki: "Stray Kids Wiki",
            img: "https://www.musikexpress.de/wp-content/uploads/2023/09/microsoftteams-image-5-scaled.jpg",
          },
          {
            name: "BTS",
            wiki: "BTS Wiki",
            img: "https://people.com/thmb/48g8cusN8eDuq5VqzH_ry6Wz_OI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(999x0:1001x2)/bts-bb98ad807ef44aada577c4510c14bce4.jpg",
          },
          // adaugă mai multe iteme după nevoie
        ]}
      />
      <FeedSection
        title="Popular K-Doms"
        viewAllUrl="/popular"
        popularItems={[
          {
            name: "BLACKPINK",
            wiki: "BLACKPINK Wiki",
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Blackpink_Pink_Carpet_Event_4.jpg/1200px-Blackpink_Pink_Carpet_Event_4.jpg",
          },
          {
            name: "Stray Kids",
            wiki: "Stray Kids Wiki",
            img: "https://www.musikexpress.de/wp-content/uploads/2023/09/microsoftteams-image-5-scaled.jpg",
          },
          {
            name: "BTS",
            wiki: "BTS Wiki",
            img: "https://people.com/thmb/48g8cusN8eDuq5VqzH_ry6Wz_OI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(999x0:1001x2)/bts-bb98ad807ef44aada577c4510c14bce4.jpg",
          },
          // adaugă mai multe iteme după nevoie
        ]}
      />
    </Box>
  );
}
