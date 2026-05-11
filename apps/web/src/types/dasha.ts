export interface DashaPeriod {
  lord: string;
  start: string;
  end: string;
  duration_years: number;
  sub_periods?: DashaPeriod[];
}

export interface MahadashaDetail {
  lord: string;
  start: string;
  end: string;
  duration_years: number;
  percent_complete: number;
}

export interface AntardashaDetail {
  lord: string;
  start: string;
  end: string;
  percent_complete: number;
}

export interface DashaResponse {
  current_mahadasha: MahadashaDetail;
  current_antardasha: AntardashaDetail;
  sequence: DashaPeriod[];
}
